// src/lib/seedGeneralHoldingSnapshots.ts
import { prisma } from '@/lib/prisma';

/**
 * general_holding_snapshot 테이블에
 *  • id=25 레코드의 평가 금액 수정
 *  • 2025-01~06월 월말 CASH 스냅샷 삽입
 *
 * @param isaAccountId ISA 계좌의 ID
 */
export async function seedCashSnapshots(isaAccountId: bigint) {
  // 1) 기존 스냅샷 ID=25 평가 금액 차감
  await prisma.$executeRaw`
    UPDATE general_holding_snapshot
    SET evaluated_amount = evaluated_amount - 781645.00
    WHERE id = 25;
  `;

  // 2) 2025-01~06월 CASH 월말 스냅샷 일괄 삽입
  await prisma.$executeRawUnsafe(`
    INSERT INTO general_holding_snapshot
      (isa_account_id, snapshot_type, snapshot_date, evaluated_amount)
    VALUES
      (${isaAccountId}, 'CASH', '2025-01-31 23:59:59', 14092530.00),
      (${isaAccountId}, 'CASH', '2025-02-28 23:59:59', 14092530.00),
      (${isaAccountId}, 'CASH', '2025-03-31 23:59:59', 14092530.00),
      (${isaAccountId}, 'CASH', '2025-04-30 23:59:59', 14092530.00),
      (${isaAccountId}, 'CASH', '2025-05-30 23:59:59', 10101220.00),
      (${isaAccountId}, 'CASH', '2025-06-30 23:59:59', 10666450.00);
  `);
}
