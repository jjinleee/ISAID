// src/lib/seedIsaHoldingUpdates.ts
import { prisma } from '@/lib/prisma';

/**
 * 본 함수는 2025‑02 ~ 2025‑06 사이 모든 거래 내역을 그대로 etf_holding 테이블에 반영한다.
 * 각 구문은 원본 SQL과 1:1 매칭되며, 평균단가 계산식도 동일하게 유지된다.
 */
export async function seedEtfHoldingUpdate(isaAccountId: bigint) {
  // ─────────────────────────────────────────────
  // 2025‑02 (총 5건)
  // ─────────────────────────────────────────────
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 43.000000, avg_cost = ROUND(((28.000000 * 10020.00) + (15.000000 * 9390.00)) / 43.000000, 2), updated_at = '2025-02-03 09:45:00' WHERE etf_id = 1 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 17.000000, updated_at = '2025-02-03 10:30:00' WHERE etf_id = 26 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 52.000000, avg_cost = ROUND(((32.000000 * 32215.00) + (20.000000 * 32900.00)) / 52.000000, 2), updated_at = '2025-02-03 11:15:00' WHERE etf_id = 40 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 14.000000, updated_at = '2025-02-03 14:20:00' WHERE etf_id = 318 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 67.000000, avg_cost = ROUND(((42.000000 * 12135.00) + (25.000000 * 13320.00)) / 67.000000, 2), updated_at = '2025-02-03 15:30:00' WHERE etf_id = 353 AND isa_account_id = ${isaAccountId};`;

  // ─────────────────────────────────────────────
  // 2025‑03 (총 4건)
  // ─────────────────────────────────────────────
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 58.000000, avg_cost = ROUND(((43.000000 * 9684.42) + (15.000000 * 9225.00)) / 58.000000, 2), updated_at = '2025-03-03 09:45:00' WHERE etf_id = 1 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 7.000000, updated_at = '2025-03-03 10:30:00' WHERE etf_id = 26 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 32.000000, updated_at = '2025-03-03 11:15:00' WHERE etf_id = 40 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 82.000000, avg_cost = ROUND(((67.000000 * 12631.34) + (15.000000 * 10720.00)) / 82.000000, 2), updated_at = '2025-03-03 15:30:00' WHERE etf_id = 353 AND isa_account_id = ${isaAccountId};`;

  // ─────────────────────────────────────────────
  // 2025‑04 (INSERT 2건, UPDATE 1건)
  // ─────────────────────────────────────────────
  await prisma.$executeRaw`INSERT INTO etf_holding (etf_id, isa_account_id, quantity, avg_cost, acquired_at) VALUES (197, ${isaAccountId}, 25.000000, 40500.00, '2025-04-03 09:45:00');`;
  await prisma.$executeRaw`INSERT INTO etf_holding (etf_id, isa_account_id, quantity, avg_cost, acquired_at) VALUES (295, ${isaAccountId}, 30.000000, 13090.00, '2025-04-03 09:45:00');`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 72.000000, updated_at = '2025-04-03 10:30:00' WHERE etf_id = 353 AND isa_account_id = ${isaAccountId};`;

  // ─────────────────────────────────────────────
  // 2025‑05 (총 4건)
  // ─────────────────────────────────────────────
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 17.000000, avg_cost = ROUND(((7.000000 * 32010.00) + (10.000000 * 34440.00)) / 17.000000, 2), updated_at = '2025-05-12 09:45:00' WHERE etf_id = 26 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 10.000000, updated_at = '2025-05-13 09:45:00' WHERE etf_id = 197 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 20.000000, updated_at = '2025-05-22 12:43:00' WHERE etf_id = 295 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 82.000000, avg_cost = ROUND(((72.000000 * 12693.29) + (10.000000 * 12760.00)) / 82.000000, 2), updated_at = '2025-05-27 10:30:00' WHERE etf_id = 353 AND isa_account_id = ${isaAccountId};`;

  // ─────────────────────────────────────────────
  // 2025‑06 (총 6건)
  // ─────────────────────────────────────────────
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 68.000000, avg_cost = ROUND(((58.000000 * 9608.28) + (10.000000 * 8855.00)) / 68.000000, 2), updated_at = '2025-06-04 09:45:00' WHERE etf_id = 1 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 45.000000, avg_cost = ROUND(((17.000000 * 33434.12) + (28.000000 * 39640.00)) / 45.000000, 2), updated_at = '2025-06-18 09:45:00' WHERE etf_id = 26 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 5.000000, updated_at = '2025-06-18 09:45:00' WHERE etf_id = 197 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 10.000000, updated_at = '2025-06-09 12:43:00' WHERE etf_id = 295 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`DELETE FROM etf_holding WHERE etf_id = 318 AND isa_account_id = ${isaAccountId};`;
  await prisma.$executeRaw`UPDATE etf_holding SET quantity = 92.000000, avg_cost = ROUND(((82.000000 * 12701.46) + (10.000000 * 13900.00)) / 92.000000, 2), updated_at = '2025-06-16 10:30:00' WHERE etf_id = 353 AND isa_account_id = ${isaAccountId};`;
}
