import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function getISAPortfolio(yearMonth: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error('Unauthorized');
  }

  const [year, month] = yearMonth.split('-').map(Number);
  const snapshotDate = new Date(Date.UTC(year, month, 0));

  const isa = await prisma.iSAAccount.findUnique({
    where: { userId: BigInt(session.user.id) },
    select: {
      generalHoldingSnapshots: {
        where: {
          snapshotDate: {
            gte: snapshotDate,
            lt: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        select: {
          evaluatedAmount: true,
          snapshotType: true,
        },
      },
      generalHoldings: {
        select: {
          totalCost: true,
          product: {
            select: {
              instrumentType: true,
            },
          },
        },
      },
      etfHoldingSnapshots: {
        where: {
          snapshotDate: {
            gte: snapshotDate,
            lt: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        select: {
          evaluatedAmount: true,
          etf: {
            select: {
              idxMarketType: true, // "국내", "해외", "국내&해외"
            },
          },
        },
      },
    },
  });

  if (!isa) throw new Error('ISA account not found');

  console.log(`Portfolio snapshot for ${yearMonth}`);

  let bond = 0;
  let fund = 0;
  let els = 0;

  for (const holding of isa.generalHoldings) {
    if (holding.product?.instrumentType === 'BOND') {
      bond += Number(holding.totalCost);
    } else if (holding.product?.instrumentType === 'FUND') {
      fund += Number(holding.totalCost);
    } else {
      els += Number(holding.totalCost);
    }
  }

  let etfDomestic = 0;
  let etfForeign = 0;
  let etfBoth = 0;
  for (const etf of isa.etfHoldingSnapshots) {
    const value = Number(etf.evaluatedAmount);
    const type = etf.etf.idxMarketType;
    if (type === '국내') etfDomestic += value;
    else if (type === '해외') etfForeign += value;
    else if (type === '국내&해외') etfBoth += value;
  }

  console.log('ETF Domestic total:', etfDomestic);
  console.log('ETF Foreign total:', etfForeign);
  console.log('ETF Domestic&Foreign total:', etfBoth);

  const total = bond + fund + els + etfDomestic + etfForeign + etfBoth;

  const format = (label: string, value: number) => ({
    category: label,
    value,
    percentage: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
  });

  return [
    format('채권', bond),
    format('펀드', fund),
    format('ELS', els),
    format('국내 ETF', etfDomestic),
    format('해외 ETF', etfForeign),
    format('국내&해외 ETF', etfBoth),
  ];
}
