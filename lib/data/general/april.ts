// src/lib/seedGeneralApril.ts
import { prisma } from '@/lib/prisma';

/**
 * 2025-04 general transactions, holdings, and snapshots for a given ISA account.
 */
export async function seedGeneralApril(isaAccountId: bigint) {
  // 1) 4월 매수 거래
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 2,
        isaAccountId,
        transactionType: 'BUY',
        price: 100_000,
        transactionAt: new Date('2025-04-03T11:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'BUY',
        price: 200_000,
        transactionAt: new Date('2025-04-10T15:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'BUY',
        price: 100_000,
        transactionAt: new Date('2025-04-25T13:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 2) 5월 초 이자 거래
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 2,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-05-03T11:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-05-10T15:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-05-25T13:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 3) general_holding 반영: 2번 +100k, 3번 +200k, 4번 +100k
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 2 },
    },
    data: { totalCost: { increment: 100_000 }, updatedAt: new Date() },
  });
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 3 },
    },
    data: { totalCost: { increment: 200_000 }, updatedAt: new Date() },
  });
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: { isaAccountId, productId: 4 },
    },
    data: { totalCost: { increment: 100_000 }, updatedAt: new Date() },
  });

  // 4) 월말 CASH 스냅샷: −400k 매수 +10k 이자
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount - 400000 + 10000
    WHERE isa_account_id = ${isaAccountId}
      AND snapshot_type = 'CASH'
      AND snapshot_date = '2025-04-30 23:59:59';
  `;

  // 5) 월말 GENERAL 스냅샷 추가
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'GENERAL', '2025-04-30 23:59:59', 3200000);
  `);
}
