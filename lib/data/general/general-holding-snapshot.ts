// src/lib/data/general-holding-snapshots.ts
import { prisma } from '@/lib/prisma';

export async function seedGeneralHoldingSnapshots(isaAccountId: bigint) {
  await prisma.generalHoldingSnapshot.createMany({
    data: [
      {
        isaAccountId,
        snapshotType: 'GENERAL',
        snapshotDate: new Date('2025-01-31T23:59:59.000Z'),
        evaluatedAmount: 2_200_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-01-31T23:59:59.000Z'),
        evaluatedAmount: 11_892_530.0,
      },
      {
        isaAccountId,
        snapshotType: 'GENERAL',
        snapshotDate: new Date('2025-02-28T23:59:59.000Z'),
        evaluatedAmount: 2_700_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-02-28T23:59:59.000Z'),
        evaluatedAmount: 10_680_380.0,
      },
      {
        isaAccountId,
        snapshotType: 'GENERAL',
        snapshotDate: new Date('2025-03-31T23:59:59.000Z'),
        evaluatedAmount: 2_800_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-03-31T23:59:59.000Z'),
        evaluatedAmount: 11_763_220.0,
      },
      {
        isaAccountId,
        snapshotType: 'GENERAL',
        snapshotDate: new Date('2025-04-30T23:59:59.000Z'),
        evaluatedAmount: 3_200_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-04-30T23:59:59.000Z'),
        evaluatedAmount: 10_101_220.0,
      },
      {
        isaAccountId,
        snapshotType: 'GENERAL',
        snapshotDate: new Date('2025-05-30T23:59:59.000Z'),
        evaluatedAmount: 2_700_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-05-30T23:59:59.000Z'),
        evaluatedAmount: 10_666_450.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-06-20T04:23:08.033Z'),
        evaluatedAmount: 17_000_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'GENERAL',
        snapshotDate: new Date('2025-06-30T23:59:59.000Z'),
        evaluatedAmount: 3_500_000.0,
      },
      {
        isaAccountId,
        snapshotType: 'CASH',
        snapshotDate: new Date('2025-06-30T23:59:59.000Z'),
        evaluatedAmount: 10_184_805.0,
      },
    ],
    skipDuplicates: true,
  });
}
