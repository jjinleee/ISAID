// src/lib/data/etf/etf-holdings.ts
import { prisma } from '@/lib/prisma';

/**
 * etf_holding 테이블에 더미 데이터를 삽입합니다.
 * @param isaAccountId - 생성된 ISA 계좌의 ID
 */
export async function seedEtfHoldings(isaAccountId: bigint) {
  await prisma.eTFHolding.createMany({
    data: [
      {
        etfId: 1,
        isaAccountId,
        quantity: 68.0,
        avgCost: 9497.5,
        acquiredAt: new Date('2025-01-02T10:00:00'),
        updatedAt: new Date('2025-06-04T09:45:00'),
      },
      {
        etfId: 26,
        isaAccountId,
        quantity: 45.0,
        avgCost: 37295.56,
        acquiredAt: new Date('2025-01-02T11:00:00'),
        updatedAt: new Date('2025-06-18T09:45:00'),
      },
      {
        etfId: 40,
        isaAccountId,
        quantity: 32.0,
        avgCost: 32478.46,
        acquiredAt: new Date('2025-01-02T10:30:00'),
        updatedAt: new Date('2025-03-03T11:15:00'),
      },
      {
        etfId: 197,
        isaAccountId,
        quantity: 5.0,
        avgCost: 40500.0,
        acquiredAt: new Date('2025-04-03T09:45:00'),
        updatedAt: new Date('2025-06-18T09:45:00'),
      },
      {
        etfId: 295,
        isaAccountId,
        quantity: 10.0,
        avgCost: 13090.0,
        acquiredAt: new Date('2025-04-03T09:45:00'),
        updatedAt: new Date('2025-06-09T12:43:00'),
      },
      {
        etfId: 353,
        isaAccountId,
        quantity: 92.0,
        avgCost: 12831.74,
        acquiredAt: new Date('2025-01-02T11:30:00'),
        updatedAt: new Date('2025-06-16T10:30:00'),
      },
    ],
    skipDuplicates: true,
  });
}
