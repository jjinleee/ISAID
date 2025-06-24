// src/lib/seedEtfHoldingSnapshots.ts
import { prisma } from '@/lib/prisma';

/**
 * etf_holding_snapshot 테이블에 월말 스냅샷을 삽입합니다.
 * @param isaAccountId ISA 계좌의 ID
 */
export async function seedEtfHoldingSnapshots(isaAccountId: bigint) {
  await prisma.eTFHoldingSnapshot.createMany({
    data: [
      // 2025-01-31
      {
        isaAccountId,
        etfId: 1,
        snapshotDate: new Date('2025-01-31T23:59:59'),
        evaluatedAmount: 266420.0,
        profit: -14140.0,
      },
      {
        isaAccountId,
        etfId: 26,
        snapshotDate: new Date('2025-01-31T23:59:59'),
        evaluatedAmount: 883710.0,
        profit: 19440.0,
      },
      {
        isaAccountId,
        etfId: 40,
        snapshotDate: new Date('2025-01-31T23:59:59'),
        evaluatedAmount: 1067040.0,
        profit: 35160.0,
      },
      {
        isaAccountId,
        etfId: 318,
        snapshotDate: new Date('2025-01-31T23:59:59'),
        evaluatedAmount: 228580.0,
        profit: 6490.0,
      },
      {
        isaAccountId,
        etfId: 353,
        snapshotDate: new Date('2025-01-31T23:59:59'),
        evaluatedAmount: 573300.0,
        profit: 63630.0,
      },
      // 2025-02-28
      {
        isaAccountId,
        etfId: 1,
        snapshotDate: new Date('2025-02-28T23:59:59'),
        evaluatedAmount: 403555.0,
        profit: -17780.0,
      },
      {
        isaAccountId,
        etfId: 26,
        snapshotDate: new Date('2025-02-28T23:59:59'),
        evaluatedAmount: 571370.0,
        profit: 27200.0,
      },
      {
        isaAccountId,
        etfId: 40,
        snapshotDate: new Date('2025-02-28T23:59:59'),
        evaluatedAmount: 1777880.0,
        profit: 63200.0,
      },
      {
        isaAccountId,
        etfId: 318,
        snapshotDate: new Date('2025-02-28T23:59:59'),
        evaluatedAmount: 149450.0,
        profit: 8120.0,
      },
      {
        isaAccountId,
        etfId: 353,
        snapshotDate: new Date('2025-02-28T23:59:59'),
        evaluatedAmount: 907410.0,
        profit: 48090.0,
      },
      // 2025-03-31
      {
        isaAccountId,
        etfId: 1,
        snapshotDate: new Date('2025-03-31T23:59:59'),
        evaluatedAmount: 557680.0,
        profit: -2770.0,
      },
      {
        isaAccountId,
        etfId: 26,
        snapshotDate: new Date('2025-03-31T23:59:59'),
        evaluatedAmount: 224070.0,
        profit: 0.0,
      },
      {
        isaAccountId,
        etfId: 40,
        snapshotDate: new Date('2025-03-31T23:59:59'),
        evaluatedAmount: 1039360.0,
        profit: 6.0,
      },
      {
        isaAccountId,
        etfId: 318,
        snapshotDate: new Date('2025-03-31T23:59:59'),
        evaluatedAmount: 149450.0,
        profit: 8120.0,
      },
      {
        isaAccountId,
        etfId: 353,
        snapshotDate: new Date('2025-03-31T23:59:59'),
        evaluatedAmount: 1040860.0,
        profit: 4131.0,
      },
      // 2025-04-30
      {
        isaAccountId,
        etfId: 1,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 515620.0,
        profit: -41661.0,
      },
      {
        isaAccountId,
        etfId: 26,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 237370.0,
        profit: 13300.0,
      },
      {
        isaAccountId,
        etfId: 40,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 1091680.0,
        profit: 52326.0,
      },
      {
        isaAccountId,
        etfId: 197,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 1095500.0,
        profit: 83000.0,
      },
      {
        isaAccountId,
        etfId: 295,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 385350.0,
        profit: -7350.0,
      },
      {
        isaAccountId,
        etfId: 318,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 172690.0,
        profit: 31360.0,
      },
      {
        isaAccountId,
        etfId: 353,
        snapshotDate: new Date('2025-04-30T23:59:59'),
        evaluatedAmount: 882720.0,
        profit: -31197.0,
      },
      // 2025-05-30
      {
        isaAccountId,
        etfId: 1,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 518230.0,
        profit: -39030.0,
      },
      {
        isaAccountId,
        etfId: 26,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 614380.0,
        profit: 46001.0,
      },
      {
        isaAccountId,
        etfId: 40,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 1162880.0,
        profit: 123525.0,
      },
      {
        isaAccountId,
        etfId: 197,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 481650.0,
        profit: 76650.0,
      },
      {
        isaAccountId,
        etfId: 295,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 251400.0,
        profit: -10400.0,
      },
      {
        isaAccountId,
        etfId: 318,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 164010.0,
        profit: 22680.0,
      },
      {
        isaAccountId,
        etfId: 353,
        snapshotDate: new Date('2025-05-30T23:59:59'),
        evaluatedAmount: 1059030.0,
        profit: 17511.0,
      },
      // 2025-06-30
      {
        isaAccountId,
        etfId: 1,
        snapshotDate: new Date('2025-06-30T23:59:59'),
        evaluatedAmount: 612000.0,
        profit: -23632.0,
      },
      {
        isaAccountId,
        etfId: 26,
        snapshotDate: new Date('2025-06-30T23:59:59'),
        evaluatedAmount: 1800000.0,
        profit: 125263.0,
      },
      {
        isaAccountId,
        etfId: 40,
        snapshotDate: new Date('2025-06-30T23:59:59'),
        evaluatedAmount: 1120000.0,
        profit: 80646.0,
      },
      {
        isaAccountId,
        etfId: 197,
        snapshotDate: new Date('2025-06-30T23:59:59'),
        evaluatedAmount: 202500.0,
        profit: 0.0,
      },
      {
        isaAccountId,
        etfId: 295,
        snapshotDate: new Date('2025-06-30T23:59:59'),
        evaluatedAmount: 130000.0,
        profit: -910.0,
      },
      {
        isaAccountId,
        etfId: 353,
        snapshotDate: new Date('2025-06-30T23:59:59'),
        evaluatedAmount: 1196800.0,
        profit: -15494.0,
      },
    ],
    skipDuplicates: true,
  });
}
