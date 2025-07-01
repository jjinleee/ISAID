'use server';

import { getServerSession } from 'next-auth';
import {
  calculateChallengeStatus,
  type ChallengeStatus,
} from '@/services/challenge/challenge-status';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export type { ChallengeStatus };

export type ChallengeInfo = {
  id: string;
  issueName: string;
  title: string;
  challengeDescription: string;
  quantity: number;
  status: ChallengeStatus;
};

export async function getChallenges(): Promise<ChallengeInfo[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');
  const userId = BigInt(session.user.id);

  const rows = await prisma.challenge.findMany({
    include: {
      etf: { select: { issueName: true } },
      userChallengeClaims: {
        where: { userId },
        select: { claimDate: true },
      },
      userChallengeProgresses: {
        where: { userId },
        select: { progressVal: true, createdAt: true, updatedAt: true },
      },
    },
  });

  return rows.map((c) => {
    const status = calculateChallengeStatus(c, userId);

    return {
      id: c.id.toString(),
      issueName: c.etf.issueName ?? '',
      title: c.title,
      challengeDescription: c.challengeDescription,
      quantity: Number(c.quantity),
      status,
    };
  });
}
