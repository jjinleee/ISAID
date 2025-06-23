// src/lib/seedGeneralMay.ts
import { prisma } from '@/lib/prisma';

/**
 * 2025-05 general transactions, holdings, and snapshots for a given ISA account.
 */
export async function seedGeneralMay(isaAccountId: bigint) {
  // 1) 5월 매도 거래
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 300_000,
        transactionAt: new Date('2025-05-12T11:30:00'),
      },
      {
        productId: 5,
        isaAccountId,
        transactionType: 'SELL',
        price: 100_000,
        transactionAt: new Date('2025-05-13T15:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'SELL',
        price: 100_000,
        transactionAt: new Date('2025-05-29T13:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 2) general_holding 반영: 제품 1,5,2 각각 –300k, –100k, –100k
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 1 },
    },
    data: { totalCost: { decrement: 300_000 }, updatedAt: new Date() },
  });
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 5 },
    },
    data: { totalCost: { decrement: 100_000 }, updatedAt: new Date() },
  });
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 2 },
    },
    data: { totalCost: { decrement: 100_000 }, updatedAt: new Date() },
  });

  // 3) 월말 CASH 스냅샷: +500k 매도금 +3k 이자
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount + 500000 + 3000
    WHERE isa_account_id = ${isaAccountId}
      AND snapshot_type = 'CASH'
      AND snapshot_date = '2025-05-31 23:59:59';
  `;

  // 4) 월말 GENERAL 스냅샷 추가
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'GENERAL', '2025-05-31 23:59:59', 2700000);
  `);
}
