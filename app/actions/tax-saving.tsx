/**
 * ISA 절세 계산기 ― ETF 배당 비과세 + 잔여 한도 계산
 * “지금 전부 매도해 현금화(만기 가정)” 시, ISA vs 일반계좌 세금을 비교합니다.
 */
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

const TAX_INT_DIV = 0.154; // 일반 계좌 15.4 %
const ISA_TAX_RATE = 0.099; // ISA 9.9 %
const DIV_YIELD = 0.02; // ETF 연 2 % 배당률

export const taxSaving = async () => {
  /* 1) 세션 & ISA 정보 */
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

  /* 2) 경과 월 계산(1‒12) */
  const months = new Date().getMonth() + 1;

  /* 3) 배당·이자: net → gross(세전) */
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
  const grossDiv = netDiv; // 역산 생략

  /* 4) ETF 평가이익·예상 배당(gross) */
  const hlds = await prisma.eTFHolding.findMany({
    where: { isaAccountId: isaId },
    select: {
      etfId: true,
      avgCost: true,
      quantity: true,
      etf: { select: { idxMarketType: true } },
    },
  });

  let unAll = 0; // 미실현 총 평가이익(국내+해외)
  let unOver = 0; // 미실현 해외 평가이익
  let estDiv = 0; // 보유 ETF 예상 배당(gross)

  for (const h of hlds) {
    const cost = h.avgCost.toNumber() * h.quantity.toNumber();

    const px = await prisma.etfDailyTrading.findFirst({
      where: { etfId: h.etfId },
      orderBy: { baseDate: 'desc' },
      select: { tddClosePrice: true },
    });
    const price = px?.tddClosePrice?.toNumber() ?? h.avgCost.toNumber();

    const evalV = price * h.quantity.toNumber();
    const prft = evalV - cost; // 평가이익(+)/손실(−)

    unAll += prft;
    if (h.etf.idxMarketType === '해외') unOver += prft;

    estDiv += evalV * DIV_YIELD * (months / 12); // 올해 받게 될 예상 배당(gross)
  }

  /* 5) 해외 ETF 실현 차익 */
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

  /* === “만기 가정” 핵심 수정 ===
     해외 ETF 이익 = 이미 실현 + (현 시점에서 매도 시) 미실현 */
  const totalOverseaGain = Math.max(0, realizedOver) + unOver;

  /* 6) 배당·이자(gross) */
  const genDiv = grossDiv + estDiv;

  /* 7) 누적 손익(참고용) */
  const totalProfitAll = genDiv + unAll; // 배당·이자 + ETF 전체 평가이익

  /* 8) 일반계좌 과세 표준 & 세액 (15.4 %) */
  const totalTaxableGeneral = genDiv + totalOverseaGain;
  const generalAccountTax = totalTaxableGeneral * TAX_INT_DIV;

  /* 9) ISA 한도 사용액 & 과세표준(초과분만 9.9 %) */
  // const usedLimit = grossDiv + totalOverseaGain;
  const usedLimit = Math.min(limit, grossDiv + estDiv + totalOverseaGain);
  const remainingLimit = Math.max(0, limit - usedLimit);

  const isaTaxBase = Math.max(0, grossDiv + estDiv + totalOverseaGain - limit);
  const isaTax = isaTaxBase * ISA_TAX_RATE;

  /* 10) 절세 효과 */
  const savedTax = Math.max(0, generalAccountTax - isaTax);

  return {
    totalTaxableGeneral, // 일반계좌 과세 손익(세전)
    unrealizedOversea: unOver,
    generalAccountTax, // 일반계좌 세액
    usedLimit, // ISA 비과세 한도 사용액
    isaTax, // ISA 세액
    savedTax, // 절세 효과(차이)
    remainingTaxFreeLimit: remainingLimit,
    limit,
  };
};
