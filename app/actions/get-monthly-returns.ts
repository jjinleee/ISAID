'use server';

import { prisma } from '@/lib/prisma';

export async function getMonthlyReturns(
  isaAccountId: number,
  baseDate: string,
  initialInvestment: number
) {
  try {
    //월별 수익률 목록
    const returns = await prisma.monthlyReturn.findMany({
      where: {
        isaAccountId: isaAccountId,
      },
      orderBy: {
        baseDate: 'asc',
      },
      select: {
        baseDate: true,
        entireProfit: true,
      },
    });

    //디버깅용 로그 %로 표시
    returns.forEach((r) => {
      console.log(
        `${r.baseDate.toISOString().slice(0, 10)}: ${(Number(r.entireProfit) * 100).toFixed(2)}%`
      );
    });

    const snapshotDate = new Date(`${baseDate}T23:59:59.000Z`);
    if (isNaN(snapshotDate.getTime())) {
      throw new Error(`Invalid baseDate: ${baseDate}`);
    }

    // 평가금액 계산= etf+general+ 현금
    const etfEvaluated = await prisma.eTFHoldingSnapshot.aggregate({
      where: {
        isaAccountId,
        snapshotDate,
      },
      _sum: {
        evaluatedAmount: true,
      },
    });

    const generalEvaluated = await prisma.generalHoldingSnapshot.aggregate({
      where: {
        isaAccountId,
        snapshotDate,
        snapshotType: {
          in: ['GENERAL', 'CASH'],
        },
      },
      _sum: {
        evaluatedAmount: true,
      },
    });

    const totalEvaluatedAmount =
      Number(etfEvaluated._sum.evaluatedAmount ?? 0) +
      Number(generalEvaluated._sum.evaluatedAmount ?? 0);

    const totalInvestedAmount = initialInvestment;

    const 평가수익 = totalEvaluatedAmount - totalInvestedAmount;

    console.log(
      `평가 금액 (${baseDate}): ${totalEvaluatedAmount.toLocaleString()}원`
    );
    console.log(`평가 수익: ${평가수익.toLocaleString()}원`);

    return {
      returns,
      평가금액: totalEvaluatedAmount,
      평가수익,
    };
  } catch (error) {
    console.error('[getMonthlyReturns] Error:', error);
    throw new Error('Failed to fetch monthly returns');
  }
}
