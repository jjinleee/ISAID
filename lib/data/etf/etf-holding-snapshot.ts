import { prisma } from '@/lib/prisma';

/**
 * 월말 보유 스냅샷을 삽입한다.
 * 기존 스냅샷은 삭제(DELETE) 후 월별 INSERT 를 그대로 반영.
 * @param isaAccountId 연결된 ISA 계좌 id (ex. newAccount.id)
 */
export async function seedIsaHoldingSnapshot(isaAccountId: bigint) {
  // 0. 기존 스냅샷 전부 제거
  await prisma.$executeRaw`DELETE FROM etf_holding_snapshot WHERE isa_account_id = ${isaAccountId};`;

  /* ------------------------------------------------------------------ */
  /* 1) 2025-01-31 스냅샷                                              */
  /* ------------------------------------------------------------------ */
  await prisma.$executeRawUnsafe(`
    INSERT INTO etf_holding_snapshot
      (isa_account_id, etf_id, snapshot_date, evaluated_amount, profit)
    VALUES
      (${isaAccountId}, 1,  '2025-01-31 23:59:59', 266420.00, -14140.00),
      (${isaAccountId}, 26, '2025-01-31 23:59:59', 883710.00,  19440.00),
      (${isaAccountId}, 40, '2025-01-31 23:59:59', 1067040.00, 35160.00),
      (${isaAccountId}, 318,'2025-01-31 23:59:59', 228580.00,  6490.00),
      (${isaAccountId}, 353,'2025-01-31 23:59:59', 573300.00,  63630.00);
  `);

  /* ------------------------------------------------------------------ */
  /* 2) 2025-02-28 스냅샷                                              */
  /* ------------------------------------------------------------------ */
  await prisma.$executeRawUnsafe(`
    INSERT INTO etf_holding_snapshot
      (isa_account_id, etf_id, snapshot_date, evaluated_amount, profit)
    VALUES
      (${isaAccountId}, 1,  '2025-02-28 23:59:59', 403555.00, -17780.00),
      (${isaAccountId}, 26, '2025-02-28 23:59:59', 571370.00,  27200.00),
      (${isaAccountId}, 40, '2025-02-28 23:59:59', 1777880.00, 63200.00),
      (${isaAccountId}, 318,'2025-02-28 23:59:59', 149450.00,  8120.00),
      (${isaAccountId}, 353,'2025-02-28 23:59:59', 907410.00,  48090.00);
  `);

  /* ------------------------------------------------------------------ */
  /* 3) 2025-03-31 스냅샷                                              */
  /* ------------------------------------------------------------------ */
  await prisma.$executeRawUnsafe(`
    INSERT INTO etf_holding_snapshot
      (isa_account_id, etf_id, snapshot_date, evaluated_amount, profit)
    VALUES
      (${isaAccountId}, 1,  '2025-03-31 23:59:59', 557680.00,  -2770.00),
      (${isaAccountId}, 26, '2025-03-31 23:59:59', 224070.00,      0.00),
      (${isaAccountId}, 40, '2025-03-31 23:59:59', 1039360.00,      6.00),
      (${isaAccountId}, 318,'2025-03-31 23:59:59', 149450.00,   8120.00),
      (${isaAccountId}, 353,'2025-03-31 23:59:59', 1040860.00,  4131.00);
  `);

  /* ------------------------------------------------------------------ */
  /* 4) 2025-04-30 스냅샷                                              */
  /* ------------------------------------------------------------------ */
  await prisma.$executeRawUnsafe(`
    INSERT INTO etf_holding_snapshot
      (isa_account_id, etf_id, snapshot_date, evaluated_amount, profit)
    VALUES
      (${isaAccountId}, 1,  '2025-04-30 23:59:59', 515620.00,  -41661.00),
      (${isaAccountId}, 26, '2025-04-30 23:59:59', 237370.00,   13300.00),
      (${isaAccountId}, 40, '2025-04-30 23:59:59', 1091680.00,  52326.00),
      (${isaAccountId}, 197,'2025-04-30 23:59:59', 1095500.00,  83000.00),
      (${isaAccountId}, 295,'2025-04-30 23:59:59', 385350.00,   -7350.00),
      (${isaAccountId}, 318,'2025-04-30 23:59:59', 172690.00,   31360.00),
      (${isaAccountId}, 353,'2025-04-30 23:59:59', 882720.00,  -31197.00);
  `);

  /* ------------------------------------------------------------------ */
  /* 5) 2025-05-31 스냅샷                                              */
  /* ------------------------------------------------------------------ */
  await prisma.$executeRawUnsafe(`
    INSERT INTO etf_holding_snapshot
      (isa_account_id, etf_id, snapshot_date, evaluated_amount, profit)
    VALUES
      (${isaAccountId}, 1,  '2025-05-31 23:59:59', 518230.00,  -39030.00),
      (${isaAccountId}, 26, '2025-05-31 23:59:59', 614380.00,   46001.00),
      (${isaAccountId}, 40, '2025-05-31 23:59:59', 1162880.00, 123525.00),
      (${isaAccountId}, 197,'2025-05-31 23:59:59', 481650.00,   76650.00),
      (${isaAccountId}, 295,'2025-05-31 23:59:59', 251400.00,  -10400.00),
      (${isaAccountId}, 318,'2025-05-31 23:59:59', 164010.00,   22680.00),
      (${isaAccountId}, 353,'2025-05-31 23:59:59', 1059030.00,  17511.00);
  `);

  /* ------------------------------------------------------------------ */
  /* 6) 2025-06-30 스냅샷                                              */
  /* ------------------------------------------------------------------ */
  await prisma.$executeRawUnsafe(`
    INSERT INTO etf_holding_snapshot
      (isa_account_id, etf_id, snapshot_date, evaluated_amount, profit)
    VALUES
      (${isaAccountId}, 1,  '2025-06-30 23:59:59', 612000.00,  -23632.00),
      (${isaAccountId}, 26, '2025-06-30 23:59:59', 1800000.00, 125263.00),
      (${isaAccountId}, 40, '2025-06-30 23:59:59', 1120000.00,  80646.00),
      (${isaAccountId}, 197,'2025-06-30 23:59:59', 202500.00,       0.00),
      (${isaAccountId}, 295,'2025-06-30 23:59:59', 130000.00,    -910.00),
      (${isaAccountId}, 353,'2025-06-30 23:59:59', 1196800.00, -15494.00);
  `);
}
