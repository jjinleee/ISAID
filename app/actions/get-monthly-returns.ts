'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function getMonthlyReturns(baseDate: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
    const userId = Number(session.user.id);

    const isaAccount = await prisma.iSAAccount.findUnique({
      where: { userId },
      select: { id: true, accountType: true },
    });

    const isaAccountId = Number(isaAccount?.id);
    if (!isaAccountId) {
      throw new Error('ISA 계좌가 없습니다.');
    }
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

    const formattedReturns = returns.map((r) => ({
      [r.baseDate.toISOString().slice(0, 10)]: Number(
        (Number(r.entireProfit) * 100).toFixed(2)
      ),
    }));

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
    console.log('totalEvaluatedAmount : ', totalEvaluatedAmount);

    const totalInvestedAmount = 17_000_000; // 고정 초기 투자금

    const evaluatedProfit = totalEvaluatedAmount - totalInvestedAmount;

    // console.log(
    //   `평가 금액 (${baseDate}): ${totalEvaluatedAmount.toLocaleString()}원`
    // );
    // console.log(`평가 수익: ${evaluatedProfit.toLocaleString()}원`);

    return {
      returns: formattedReturns,
      evaluatedAmount: totalEvaluatedAmount,
      evaluatedProfit: evaluatedProfit,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[getMonthlyReturns] Error:', error.message);
    } else {
      console.error('[getMonthlyReturns] Unknown error:', error);
    }
    throw new Error('Failed to fetch monthly returns');
  }
}
