// src/lib/seedMonthlyReturns.ts
import { prisma } from '@/lib/prisma';

/**
 * monthly_return 테이블에 월별 수익률 데이터를 삽입합니다.
 * @param isaAccountId ISA 계좌의 ID
 */
export async function seedMonthlyReturns(isaAccountId: bigint) {
  await prisma.monthlyReturn.createMany({
    data: [
      {
        isaAccountId,
        baseDate: new Date('2025-01-01T00:00:00.000Z'),
        entireProfit: 0.006564,
      },
      {
        isaAccountId,
        baseDate: new Date('2025-02-01T00:00:00.000Z'),
        entireProfit: 0.004,
      },
      {
        isaAccountId,
        baseDate: new Date('2025-03-01T00:00:00.000Z'),
        entireProfit: 0.022079,
      },
      {
        isaAccountId,
        baseDate: new Date('2025-04-01T00:00:00.000Z'),
        entireProfit: 0.00606,
      },
      {
        isaAccountId,
        baseDate: new Date('2025-05-01T00:00:00.000Z'),
        entireProfit: -0.003796,
      },
      {
        isaAccountId,
        baseDate: new Date('2025-06-01T00:00:00.000Z'),
        entireProfit: 0.06403,
      },
    ],
    skipDuplicates: true,
  });
}
