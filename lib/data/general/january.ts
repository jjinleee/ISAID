// src/lib/seedGeneralAccountData.ts
import { prisma } from '@/lib/prisma';

/**
 * 특정 ISA 계좌에 대해
 *  1) 2025-01 일반 거래(매수) 4건 시드
 *  2) 2025-02 이자 발생 4건 시드
 *  3) general_holding(총투자원금) 4건 시드 with acquiredAt/updatedAt
 *  4) 2025-01-31 월말 CASH 스냅샷 차감
 *  5) 2025-01-31 월말 GENERAL 스냅샷 추가
 */
export async function seedGeneralJanuary(isaAccountId: bigint) {
  // 1) 2025-01 일반 거래 매수
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 1,
        isaAccountId,
        transactionType: 'BUY',
        price: 1_000_000,
        transactionAt: new Date('2025-01-03T14:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'BUY',
        price: 550_000,
        transactionAt: new Date('2025-01-07T14:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'BUY',
        price: 200_000,
        transactionAt: new Date('2025-01-11T14:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'BUY',
        price: 450_000,
        transactionAt: new Date('2025-01-23T14:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 2) 2025-02 이자 발생
  await prisma.generalTransaction.createMany({
    data: [
      {
        productId: 1,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 3_500,
        transactionAt: new Date('2025-02-03T14:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_500,
        transactionAt: new Date('2025-02-07T14:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1_000,
        transactionAt: new Date('2025-02-11T14:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 4_000,
        transactionAt: new Date('2025-02-23T14:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 3) general_holding에 총투자원금 반영 (acquiredAt/updatedAt 추가)
  await prisma.generalHolding.createMany({
    data: [
      {
        productId: 1,
        isaAccountId,
        totalCost: 1_000_000,
        acquiredAt: new Date('2025-01-03T14:30:00'),
        updatedAt: new Date('2025-01-03T14:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        totalCost: 550_000,
        acquiredAt: new Date('2025-01-07T14:30:00'),
        updatedAt: new Date('2025-01-07T14:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        totalCost: 200_000,
        acquiredAt: new Date('2025-01-11T14:30:00'),
        updatedAt: new Date('2025-01-11T14:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        totalCost: 450_000,
        acquiredAt: new Date('2025-01-23T14:30:00'),
        updatedAt: new Date('2025-01-23T14:30:00'),
      },
    ],
    skipDuplicates: true,
  });

  // 4) 2025-01-31 월말 CASH 스냅샷 차감 (2,200,000원)
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount - 2200000
    WHERE isa_account_id = ${isaAccountId}
      AND snapshot_type = 'CASH'
      AND snapshot_date = '2025-01-31 23:59:59';
  `;

  // 5) 2025-01-31 월말 GENERAL 스냅샷 추가 (2,200,000원)
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'GENERAL', '2025-01-31 23:59:59', 2200000);
  `);
}
