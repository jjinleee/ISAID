// src/lib/seedGeneralMarch.ts
import { prisma } from '@/lib/prisma';

/**
 * 2025-03 general transactions, holdings, and snapshots for a given ISA account.
 */
export async function seedGeneralMarch(isaAccountId: bigint) {
  // 1) 3월 매수/매도 거래 세팅
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 5,
        isaAccountId,
        transactionType: 'BUY',
        price: 300_000,
        transactionAt: new Date('2025-03-07T11:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 100_000,
        transactionAt: new Date('2025-03-18T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 100_000,
        transactionAt: new Date('2025-03-20T13:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 2) 4월 초 배당 거래 세팅
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 5,
        isaAccountId,
        transactionType: 'DIVIDEND',
        price: 1_000,
        transactionAt: new Date('2025-04-07T11:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 3) general_holding 반영: 5번 +300k, 1번 −200k
  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: {
        isaAccountId,
        productId: 5,
      },
    },
    data: {
      totalCost: { increment: 300_000 },
      updatedAt: new Date(),
    },
  });

  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: {
        isaAccountId,
        productId: 1,
      },
    },
    data: {
      totalCost: { decrement: 200_000 },
      updatedAt: new Date(),
    },
  });

  // 4) 월말 CASH 스냅샷: −300k 매수 +200k 매도 +5k 이자/배당
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount - 300000 + 200000 + 5000
    WHERE isa_account_id = ${isaAccountId}
      AND snapshot_type = 'CASH'
      AND snapshot_date = '2025-03-31 23:59:59';
  `;

  // 5) 월말 GENERAL 스냅샷 추가
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'GENERAL', '2025-03-31 23:59:59', 2800000);
  `);
}
