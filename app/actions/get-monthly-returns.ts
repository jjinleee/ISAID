'use server';

import { prisma } from '@/lib/prisma';

export async function getMonthlyReturns(isaAccountId: number) {
  try {
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

    //디버깅용 로그
    returns.forEach((r) => {
      console.log(
        `${r.baseDate.toISOString().slice(0, 10)}: ${(Number(r.entireProfit) * 100).toFixed(2)}%`
      );
    });

    return returns;
  } catch (error) {
    console.error('[getMonthlyReturns] Error:', error);
    throw new Error('Failed to fetch monthly returns');
  }
}
