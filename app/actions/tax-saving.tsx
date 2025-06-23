/**
 * ISA 절세 계산기 ― “현재 시점”만 간단히 보자
 * ───────────────────────────────────────────
 * 반환값
 * {
 *   savedTax               : 일반계좌-세금 − ISA-세금 (절감액)
 *   isaProfitBeforeDeduction: 세금공제 전 ISA 수익(원)
 *   generalAccountTax      : 동일 수익을 일반계좌로 냈을 때 세금(원)
 * }
 *
 * ‣ ETF 가치는 “평균매수단가 × PRICE_MULTIPLIER(=2)” 로 가정
 * ‣ ETF 배당은 연 2 % 가정, 지금까지의 경과월 비례 반영
 * ‣ 해외 ETF 매매차익 기본공제 250 만, 과세 22 %
 * ‣ 이자·배당 세율 15.4 %
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

/* ───── 시뮬레이션 파라미터 ───── */
const PRICE_MULTIPLIER = 1.3; // 평가액 = 원가 × 2
const DIVIDEND_YIELD = 0.02; // ETF 연 배당률 2 %
const TAX_INT_DIV = 0.154; // 이자·배당 15.4 %
const TAX_OVERSEAS_ETF = 0.22; // 해외 ETF 매매차익 22 %
const OVERSEAS_DEDUCT = 2_500_000; // 해외 ETF 차익 기본공제 250 만

export const taxSaving = async () => {
  /* 1. 세션 & ISA 계좌 */
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
  const userId = Number(session.user.id);

  const isaAccount = await prisma.iSAAccount.findUnique({
    where: { userId },
    select: { id: true, accountType: true },
  });

  if (!isaAccount) {
    // ISA 계좌가 없으면 null 반환
    return null;
  }

  const isaAccountId = isaAccount.id;
  const taxFreeLimit =
    isaAccount.accountType === '서민형' ? 4_000_000 : 2_000_000;

  /* 2. 오늘 날짜 → 경과 월 수 */
  const today = new Date();
  const monthsPassed = today.getMonth() + 1; // 1 ~ 12

  /* 3. DB 이자·배당 합계 */
  const [
    {
      _sum: { price: interestSum },
    },
    {
      _sum: { price: dividendSum },
    },
  ] = await Promise.all([
    prisma.generalTransaction.aggregate({
      where: { isaAccountId, transactionType: 'INTEREST' },
      _sum: { price: true },
    }),
    prisma.generalTransaction.aggregate({
      where: { isaAccountId, transactionType: 'DIVIDEND' },
      _sum: { price: true },
    }),
  ]);
  const interestDividend =
    (interestSum?.toNumber() ?? 0) + (dividendSum?.toNumber() ?? 0);

  /* 4. 해외 ETF 원가·평가액 */
  const overseasHoldings = await prisma.eTFHolding.findMany({
    where: { isaAccountId, etf: { idxMarketType: '해외' } },
    select: { avgCost: true, quantity: true },
  });

  const totalEtfCost = overseasHoldings.reduce(
    (sum, h) =>
      sum + (h.avgCost?.toNumber() ?? 0) * (h.quantity?.toNumber() ?? 0),
    0
  );
  const totalEtfEvaluation = totalEtfCost * PRICE_MULTIPLIER;
  const etfProfit = totalEtfEvaluation - totalEtfCost;
  console.log(etfProfit);

  /* 5. 지금까지 받은 ETF 배당(추정) */
  const etfDividend = totalEtfEvaluation * DIVIDEND_YIELD * (monthsPassed / 12);

  /* 6. ISA 수익 & 세금 */
  const isaProfitBeforeDeduction = interestDividend + etfDividend + etfProfit;

  const isaTax = Math.max(0, isaProfitBeforeDeduction - taxFreeLimit) * 0.099;

  /* 7. 일반계좌 세금(같은 수익 가정) */
  const genIntDivTax = (interestDividend + etfDividend) * TAX_INT_DIV;
  const etfTaxBase = Math.max(0, etfProfit - OVERSEAS_DEDUCT);
  const genEtfTax = etfTaxBase * TAX_OVERSEAS_ETF;
  const generalAccountTax = genIntDivTax + genEtfTax;

  /* 8. 절감액 */
  const savedTax = generalAccountTax - isaTax;

  /* 9. 결과 반환 */
  return {
    savedTax, // 절세 금액
    isaProfitBeforeDeduction, // 세금공제 전 ISA 수익
    generalAccountTax, // 일반계좌 세금
  };
};
