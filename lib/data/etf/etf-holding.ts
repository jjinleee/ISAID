// src/lib/seedIsaHoldings.ts
import { prisma } from '@/lib/prisma';

/**
 * 초기 ETF 보유 내역을 etf_holding 테이블에 삽입합니다.
 * @param isaAccountId - 대상 ISA 계좌의 ID
 */
export async function seeEtfHolding(isaAccountId: bigint) {
  await prisma.eTFHolding.createMany({
    data: [
      {
        etfId: 1,
        isaAccountId,
        quantity: 28.0,
        avgCost: 10020.0,
        acquiredAt: new Date('2025-01-02T10:00:00'),
        updatedAt: new Date('2025-01-02T11:30:00'),
      },
      {
        etfId: 26,
        isaAccountId,
        quantity: 27.0,
        avgCost: 32010.0,
        acquiredAt: new Date('2025-01-02T11:00:00'),
        updatedAt: new Date('2025-01-02T11:30:00'),
      },
      {
        etfId: 40,
        isaAccountId,
        quantity: 32.0,
        avgCost: 32215.0,
        acquiredAt: new Date('2025-01-02T10:30:00'),
        updatedAt: new Date('2025-01-02T11:30:00'),
      },
      {
        etfId: 318,
        isaAccountId,
        quantity: 22.0,
        avgCost: 10095.0,
        acquiredAt: new Date('2025-01-02T09:30:00'),
        updatedAt: new Date('2025-01-02T11:30:00'),
      },
      {
        etfId: 353,
        isaAccountId,
        quantity: 42.0,
        avgCost: 12135.0,
        acquiredAt: new Date('2025-01-02T11:30:00'),
        updatedAt: new Date('2025-01-02T11:30:00'),
      },
    ],
    skipDuplicates: true,
  });
}
