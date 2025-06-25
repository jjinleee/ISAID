/**
 * ISA 절세 계산기 ― ETF 배당 비과세 + 잔여 한도 계산(배당 전부 반영)
 */
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

const TAX_INT_DIV = 0.154; // 일반 계좌 15.4 %
const ISA_TAX_RATE = 0.099; // ISA      9.9 %
const DIV_YIELD = 0.02; // ETF 연 2 % 배당률

export const taxSaving = async () => {
  /* 1) 세션 & ISA */
  const s = await getServerSession(authOptions);
  if (!s?.user?.id) throw new Error('로그인 필요');
  const userId = Number(s.user.id);

  const isa = await prisma.iSAAccount.findUnique({
    where: { userId },
    select: { id: true, accountType: true },
  });
  if (!isa) throw new Error('ISA 계좌 없음');
  const isaId = isa.id;
  const limit = isa.accountType === '서민형' ? 4_000_000 : 2_000_000;

  /* 2) 경과 월 */
  const months = new Date().getMonth() + 1;

  /* 3) net → gross 배당·이자 */
  const [intAgg, divAgg] = await Promise.all([
    prisma.generalTransaction.aggregate({
      where: { isaAccountId: isaId, transactionType: 'INTEREST' },
      _sum: { price: true },
    }),
    prisma.generalTransaction.aggregate({
      where: { isaAccountId: isaId, transactionType: 'DIVIDEND' },
      _sum: { price: true },
    }),
  ]);
  const netDiv =
    (intAgg._sum.price?.toNumber() ?? 0) + (divAgg._sum.price?.toNumber() ?? 0);
  const grossDiv = netDiv / (1 - TAX_INT_DIV); // 15.4 % 역환산

  /* 4) ETF 손익 & 추정 배당(gross) */
  const hlds = await prisma.eTFHolding.findMany({
    where: { isaAccountId: isaId },
    select: {
      etfId: true,
      avgCost: true,
      quantity: true,
      etf: { select: { idxMarketType: true } },
    },
  });

  let unAll = 0,
    unOver = 0,
    estDiv = 0;
  for (const h of hlds) {
    const cost = h.avgCost.toNumber() * h.quantity.toNumber();
    const px = await prisma.etfDailyTrading.findFirst({
      where: { etfId: h.etfId },
      orderBy: { baseDate: 'desc' },
      select: { tddClosePrice: true },
    });
    const price = px?.tddClosePrice?.toNumber() ?? h.avgCost.toNumber();
    const evalV = price * h.quantity.toNumber();
    const prft = evalV - cost;

    unAll += prft;
    if (h.etf.idxMarketType === '해외') unOver += prft;

    estDiv += evalV * DIV_YIELD * (months / 12); // ETF 예상 배당(gross)
  }

  /* 5) 실현 해외 ETF 차익 */
  const [sell, buy] = await Promise.all([
    prisma.eTFTransaction.aggregate({
      where: {
        isaAccountId: isaId,
        transactionType: 'SELL',
        etf: { idxMarketType: '해외' },
      },
      _sum: { price: true },
    }),
    prisma.eTFTransaction.aggregate({
      where: {
        isaAccountId: isaId,
        transactionType: 'BUY',
        etf: { idxMarketType: '해외' },
      },
      _sum: { price: true },
    }),
  ]);
  const realizedOver =
    (sell._sum.price?.toNumber() ?? 0) - (buy._sum.price?.toNumber() ?? 0);

  /* 6) 배당·이자(gross) 합산 → 일반 계좌 과세 손익 */
  const genDiv = grossDiv + estDiv;

  /* 7) 대시보드 누적 손익 */
  const totalProfitAll = genDiv + unAll; // 배당·이자 + ETF 全평가이익

  /* 8) 일반 계좌 과세 손익 & 세액 */
  const totalTaxableGeneral = genDiv + unOver;
  const generalAccountTax = totalTaxableGeneral * TAX_INT_DIV;

  /* 9) ISA 한도·세액 (배당·이자 + 해외 ETF 모두 포함) */
  const usedLimit = // 한도 사용액
    grossDiv + // 배당·이자(gross)
    Math.max(0, realizedOver); // 실현 해외 ETF 차익
  const remainingLimit = Math.max(0, limit - usedLimit);

  const isaTaxBase = Math.max(
    0, // 과세표준
    grossDiv + estDiv + unOver - limit // 배당·이자(gross)+ETF 해외이익 − 한도
  );
  const isaTax = isaTaxBase * ISA_TAX_RATE;

  /* 10) 절세 효과 */
  const savedTax = Math.max(0, generalAccountTax - isaTax);

  return {
    totalTaxableGeneral, // 일반 계좌 과세 손익
    unrealizedOversea: unOver,
    generalAccountTax,
    usedLimit, // ISA 공제 전 세액
    isaTax,
    savedTax,
    remainingTaxFreeLimit: remainingLimit,
    limit,
  };
};
