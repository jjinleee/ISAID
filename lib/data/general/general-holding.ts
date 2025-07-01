// src/lib/seedGeneralHoldings.ts
import { prisma } from '@/lib/prisma';

/**
 * 특정 ISA 계좌에 대해 general_holding 테이블에 더미 보유 내역을 삽입합니다.
 * @param isaAccountId - 생성된 ISA 계좌의 ID
 */
export async function seedGeneralHoldings(isaAccountId: bigint) {
  await prisma.generalHolding.createMany({
    data: [
      {
        productId: 1,
        isaAccountId,
        totalCost: 400000.0,
        acquiredAt: new Date('2025-06-20T11:08:01.000Z'),
        updatedAt: new Date('2025-06-20T15:51:01.000Z'),
      },
      {
        productId: 2,
        isaAccountId,
        totalCost: 450000.0,
        acquiredAt: new Date('2025-06-20T11:08:01.000Z'),
        updatedAt: new Date('2025-06-20T15:51:00.000Z'),
      },
      {
        productId: 3,
        isaAccountId,
        totalCost: 500000.0,
        acquiredAt: new Date('2025-06-20T11:08:01.000Z'),
        updatedAt: new Date('2025-06-20T15:51:00.000Z'),
      },
      {
        productId: 4,
        isaAccountId,
        totalCost: 550000.0,
        acquiredAt: new Date('2025-06-20T11:08:01.000Z'),
        updatedAt: new Date('2025-06-20T12:35:35.000Z'),
      },
      {
        productId: 5,
        isaAccountId,
        totalCost: 500000.0,
        acquiredAt: new Date('2025-06-20T15:24:19.000Z'),
        updatedAt: new Date('2025-06-20T15:24:19.000Z'),
      },
    ],
    skipDuplicates: true,
  });
}
