import { getServerSession } from 'next-auth';
import { taxSaving } from '@/app/actions/tax-saving';
import { prisma } from '@/lib/prisma';

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    iSAAccount: { findUnique: jest.fn() },
    generalTransaction: { aggregate: jest.fn() },
    eTFTransaction: { aggregate: jest.fn() },
    eTFHolding: { findMany: jest.fn() },
    etfDailyTrading: { findFirst: jest.fn() },
  },
}));

beforeAll(() => {
  jest
    .spyOn(Date, 'now')
    .mockReturnValue(new Date('2025-06-15T00:00:00Z').getTime());
});
afterAll(() => jest.restoreAllMocks());

describe('taxSaving – 두 시나리오 (usedLimit capped but isaTax on full overflow)', () => {
  (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });

  it('1. 일반형 / grossDiv=20만원, estDiv=10만원, gain=500만원', async () => {
    // 셋업
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      accountType: '일반형',
    });
    // grossDiv
    (prisma.generalTransaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 200_000 } } })
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 0 } } });
    // estDiv = 10M*2%*6/12 =100k
    (prisma.eTFHolding.findMany as jest.Mock).mockResolvedValue([
      {
        etfId: 1,
        avgCost: { toNumber: () => 10_000_000 },
        quantity: { toNumber: () => 1 },
        etf: { idxMarketType: '국내' },
      },
    ]);
    (prisma.etfDailyTrading.findFirst as jest.Mock).mockResolvedValue({
      tddClosePrice: { toNumber: () => 10_000_000 },
    });
    // 해외 gain
    (prisma.eTFTransaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 5_000_000 } } })
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 0 } } });

    const res = await taxSaving();

    // 계산
    const grossDiv = 200_000;
    const estDiv = 100_000;
    const gain = 5_000_000;
    const sum = grossDiv + estDiv + gain; // 5_300_000
    const tax = sum * 0.154; // 816200
    const limit = 2_000_000;
    const used = limit; // capped
    const remaining = 0;
    const isaBase = sum - limit; // 3_300_000
    const isaTax = isaBase * 0.099; // 326700
    const saved = tax - isaTax; // 489500

    expect(res.limit).toBe(limit);
    expect(res.totalTaxableGeneral).toBe(sum);
    expect(res.generalAccountTax).toBeCloseTo(tax, 2);
    expect(res.usedLimit).toBe(used);
    expect(res.remainingTaxFreeLimit).toBe(remaining);
    expect(res.isaTax).toBeCloseTo(isaTax, 2);
    expect(res.savedTax).toBeCloseTo(saved, 2);
  });

  it('2. 서민형 / grossDiv=10만원, estDiv=20만원, gain=600만원', async () => {
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      id: 2,
      accountType: '서민형',
    });
    (prisma.generalTransaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 100_000 } } })
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 0 } } });
    (prisma.eTFHolding.findMany as jest.Mock).mockResolvedValue([
      {
        etfId: 1,
        avgCost: { toNumber: () => 20_000_000 },
        quantity: { toNumber: () => 1 },
        etf: { idxMarketType: '해외' },
      },
    ]);
    (prisma.etfDailyTrading.findFirst as jest.Mock).mockResolvedValue({
      tddClosePrice: { toNumber: () => 20_000_000 },
    });
    (prisma.eTFTransaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 6_000_000 } } })
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 0 } } });

    const res = await taxSaving();

    const grossDiv = 100_000;
    const estDiv = 200_000;
    const gain = 6_000_000;
    const sum = grossDiv + estDiv + gain; // 6_300_000
    const tax = sum * 0.154; // 970200
    const limit = 4_000_000;
    const used = limit; // capped
    const remaining = 0;
    const isaBase = sum - limit; // 2_300_000
    const isaTax = isaBase * 0.099; // 227700
    const saved = tax - isaTax; // 742500

    expect(res.limit).toBe(limit);
    expect(res.totalTaxableGeneral).toBe(sum);
    expect(res.generalAccountTax).toBeCloseTo(tax, 2);
    expect(res.usedLimit).toBe(used);
    expect(res.remainingTaxFreeLimit).toBe(remaining);
    expect(res.isaTax).toBeCloseTo(isaTax, 2);
    expect(res.savedTax).toBeCloseTo(saved, 2);
  });

  it('3. 일반형 / grossDiv=50만원, estDiv=50만원, gain=20만원 (no cap)', async () => {
    // 계좌 타입
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      id: 3,
      accountType: '일반형',
    });
    // grossDiv = 500k
    (prisma.generalTransaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 500_000 } } })
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 0 } } });
    // estDiv = 5M*2%*6/12 = 50k
    (prisma.eTFHolding.findMany as jest.Mock).mockResolvedValue([
      {
        etfId: 1,
        avgCost: { toNumber: () => 5_000_000 },
        quantity: { toNumber: () => 1 },
        etf: { idxMarketType: '국내' },
      },
    ]);
    (prisma.etfDailyTrading.findFirst as jest.Mock).mockResolvedValue({
      tddClosePrice: { toNumber: () => 5_000_000 },
    });
    // realizedOver = 200k
    (prisma.eTFTransaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 200_000 } } })
      .mockResolvedValueOnce({ _sum: { price: { toNumber: () => 0 } } });

    const res = await taxSaving();

    // 올바른 계산
    const grossDiv = 500_000;
    const estDiv = 50_000;
    const gain = 200_000;
    const sum = grossDiv + estDiv + gain; // 750_000
    const tax = sum * 0.154; // 115,500
    const limit = 2_000_000;
    const used = sum; // 750_000
    const remaining = limit - used; // 1_250_000
    const isaTax = 0; // 한도 내 전부 비과세
    const saved = tax; // 115,500

    expect(res.limit).toBe(limit);
    expect(res.totalTaxableGeneral).toBe(sum);
    expect(res.generalAccountTax).toBeCloseTo(tax, 2);
    expect(res.usedLimit).toBe(used);
    expect(res.remainingTaxFreeLimit).toBe(remaining);
    expect(res.isaTax).toBe(isaTax);
    expect(res.savedTax).toBeCloseTo(saved, 2);
  });
});
