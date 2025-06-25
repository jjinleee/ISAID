import { ChallengeCode } from '@/types/challenge';
import { PrismaTransaction } from '@/lib/prisma';

export async function insertUserChallengeProgress(
  tx: PrismaTransaction,
  userId: bigint,
  challengeCode: ChallengeCode
) {
  const challenge = await tx.challenge.findUnique({
    where: { code: challengeCode },
  });

  if (!challenge) return;

  const exists = await tx.userChallengeProgress.findUnique({
    where: { userId_challengeId: { userId, challengeId: challenge.id } },
  });

  if (!exists) {
    await tx.userChallengeProgress.create({
      data: {
        userId,
        challengeId: challenge.id,
        progressVal: 1,
      },
    });
  }
}
