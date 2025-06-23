// src/lib/seedGeneralFebruary.ts
import { prisma } from '@/lib/prisma';

/**
 * 2025-02 general transactions, holdings, and snapshots for a given ISA account.
 */
export async function seedGeneralFebruary(isaAccountId: bigint) {
  // 1) 2월 매수 거래 세팅
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 5,
        isaAccountId,
        transactionType: 'BUY',
        price: 300_000,
        transactionAt: new Date('2025-02-06T11:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'BUY',
        price: 100_000,
        transactionAt: new Date('2025-02-15T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'BUY',
        price: 100_000,
        transactionAt: new Date('2025-02-27T13:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 2) 3월 초 배당·이자 거래 세팅 (DIVIDEND / INTEREST)
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 5,
        isaAccountId,
        transactionType: 'DIVIDEND',
        price: 3_000,
        transactionAt: new Date('2025-03-06T11:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-03-15T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-03-27T13:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 3) general_holding 반영: 신규 5번 상품, 기존 1·2번 업데이트
  await prisma.generalHolding.create({
    data: {
      productId: 5,
      isaAccountId,
      totalCost: 300_000,
      acquiredAt: new Date('2025-02-06T11:30:00'),
      updatedAt: new Date('2025-02-06T11:30:00'),
    },
  });

  await prisma.generalHolding.update({
    where: {
      isaAccountId_productId: {
        isaAccountId,
        productId: 2,
      },
    },
    data: {
      totalCost: { increment: 100_000 },
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
      totalCost: { increment: 100_000 },
      updatedAt: new Date(),
    },
  });

  // 4) 월말 CASH 스냅샷: 현금 50만 차감, 배당+이자 1만 보정
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount - 500000 + 10000
    WHERE isa_account_id = ${isaAccountId}
      AND snapshot_type = 'CASH'
      AND snapshot_date = '2025-02-28 23:59:59';
  `;

  // 5) 월말 GENERAL 스냅샷 추가 (500k 투자 원금)
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'GENERAL', '2025-02-28 23:59:59', 2700000);
  `);
}
