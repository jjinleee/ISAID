// src/lib/seedGeneralJune.ts
import { prisma } from '@/lib/prisma';

/**
 * 2025-06 general transactions, holdings, and snapshots for a given ISA account.
 */
export async function seedGeneralJune(isaAccountId: bigint) {
  // 1) 6월 거래 내역
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 3,
        isaAccountId,
        transactionType: 'BUY',
        price: 100_000,
        transactionAt: new Date('2025-06-09T11:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'SELL',
        price: 200_000,
        transactionAt: new Date('2025-06-12T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 200_000,
        transactionAt: new Date('2025-06-27T13:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-07-09T11:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 2) general_holding 업데이트
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 3 },
    },
    data: { totalCost: { increment: 100_000 }, updatedAt: new Date() },
  });
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 2 },
    },
    data: { totalCost: { decrement: 200_000 }, updatedAt: new Date() },
  });
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 1 },
    },
    data: { totalCost: { decrement: 200_000 }, updatedAt: new Date() },
  });

  // 3) 월말 CASH 스냅샷 반영: -100k 매수금 + 400k 매도금
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount - 100000 + 400000
    WHERE isa_account_id = ${isaAccountId}
      AND snapshot_type = 'CASH'
      AND snapshot_date = '2025-06-30 23:59:59';
  `;

  // 4) 월말 GENERAL 스냅샷 추가
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'GENERAL', '2025-06-30 23:59:59', 3500000);
  `);
}
