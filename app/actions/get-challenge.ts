// app/actions/getChallenges.ts
'use server';

import { getServerSession } from 'next-auth';
import dayjs from 'dayjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export type ChallengeStatus = 'CLAIMED' | 'ACHIEVABLE' | 'INCOMPLETE';

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
  const today = dayjs().startOf('day');

  const rows = await prisma.challenge.findMany({
    include: {
      etf: { select: { issueName: true } },
      userChallengeClaims: {
        where: { userId },
        select: { claimDate: true },
      },
      userChallengeProgresses: {
        where: { userId },
        select: { progressVal: true },
      },
    },
  });

  return rows.map((c) => {
    const hasClaim = c.userChallengeClaims.length > 0;
    const progress = c.userChallengeProgresses[0]?.progressVal ?? 0;

    let status: ChallengeStatus;
    switch (c.challengeType) {
      case 'ONCE':
        status = hasClaim
          ? 'CLAIMED'
          : progress >= 1
            ? 'ACHIEVABLE'
            : 'INCOMPLETE';
        break;
      case 'STREAK':
        status = hasClaim
          ? 'CLAIMED'
          : progress >= 7
            ? 'ACHIEVABLE'
            : 'INCOMPLETE';
        break;
      case 'DAILY': {
        const claimedToday = c.userChallengeClaims.some((cl) =>
          today.isSame(dayjs(cl.claimDate), 'day')
        );
        status = claimedToday
          ? 'CLAIMED'
          : progress > 0
            ? 'ACHIEVABLE'
            : 'INCOMPLETE';
        break;
      }
      default:
        status = 'INCOMPLETE';
    }

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
