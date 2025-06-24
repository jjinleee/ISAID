'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

const MonthDate = {
  '1': {
    value: '2025-01-31',
  },
  '2': {
    value: '2025-02-28',
  },
  '3': {
    value: '2025-03-31',
  },
  '4': {
    value: '2025-04-30',
  },
  '5': {
    value: '2025-05-30',
  },
  '6': {
    value: '2025-06-30',
  },
} as const;

type MonthKey = keyof typeof MonthDate;

export async function getMonthlyReturns(month: MonthKey) {
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

    const formattedReturns = returns.map((r) => ({
      [r.baseDate.toISOString().slice(0, 10)]: Number(
        (Number(r.entireProfit) * 100).toFixed(2)
      ),
    }));
    const baseDate = MonthDate[month].value;

    // 실제 데이터베이스에 저장된 시간을 고려하여 범위 설정
    // 데이터가 2025-06-30T23:59:59.000Z에 저장되어 있음
    const startOfDay = new Date(`${baseDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${baseDate}T23:59:59.999Z`);

    console.log('Date Range:', {
      baseDate,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
      isaAccountId,
    });

    // 디버깅: 실제로 어떤 시간 범위가 설정되었는지 확인
    console.log('Time range check:', {
      startOfDayUTC: startOfDay.toISOString(),
      endOfDayUTC: endOfDay.toISOString(),
      targetDataTime: '2025-06-30T23:59:59.000Z',
      isTargetInRange:
        '2025-06-30T23:59:59.000Z' >= startOfDay.toISOString() &&
        '2025-06-30T23:59:59.000Z' <= endOfDay.toISOString(),
    });

    // 평가금액 계산= etf+general+ 현금
    const etfSnapshots = await prisma.eTFHoldingSnapshot.findMany({
      where: {
        isaAccountId,
        snapshotDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        etfId: true,
        evaluatedAmount: true,
        snapshotDate: true,
      },
    });
    console.log('ETF Snapshots:', etfSnapshots);

    const etfEvaluatedAmount = etfSnapshots.reduce((sum, snap) => {
      return sum + Number(snap.evaluatedAmount ?? 0);
    }, 0);
    console.log('ETF Evaluated Amount Total:', etfEvaluatedAmount);

    // General 데이터 조회 전에 전체 데이터 확인
    const allGeneralSnapshots = await prisma.generalHoldingSnapshot.findMany({
      where: {
        isaAccountId,
      },
      select: {
        snapshotDate: true,
        snapshotType: true,
        evaluatedAmount: true,
      },
      orderBy: {
        snapshotDate: 'desc',
      },
      take: 10,
    });
    console.log('Recent General Snapshots (last 10):', allGeneralSnapshots);

    const generalEvaluated = await prisma.generalHoldingSnapshot.aggregate({
      where: {
        isaAccountId,
        snapshotDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        snapshotType: {
          in: ['GENERAL', 'CASH'],
        },
      },
      _sum: {
        evaluatedAmount: true,
      },
    });
    console.log(
      'General Holding Evaluated Amount:',
      generalEvaluated._sum.evaluatedAmount
    );

    // snapshotType 필터 없이 조회해보기
    const generalWithoutTypeFilter =
      await prisma.generalHoldingSnapshot.aggregate({
        where: {
          isaAccountId,
          snapshotDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _sum: {
          evaluatedAmount: true,
        },
      });
    console.log(
      'General Without Type Filter:',
      generalWithoutTypeFilter._sum.evaluatedAmount
    );

    const totalEvaluatedAmount =
      Number(etfEvaluatedAmount ?? 0) +
      Number(generalEvaluated._sum.evaluatedAmount ?? 0);

    const totalInvestedAmount = 17_000_000; // 고정 초기 투자금

    const evaluatedProfit = totalEvaluatedAmount - totalInvestedAmount;

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
