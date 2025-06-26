'use server';

import { getServerSession } from 'next-auth';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

dayjs.extend(utc);
dayjs.extend(timezone);

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

  // KST 자정 기준 today
  const today = dayjs().tz('Asia/Seoul').startOf('day');

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
    const hasClaim = c.userChallengeClaims.length > 0;
    const progress = c.userChallengeProgresses[0]?.progressVal ?? 0;
    const updatedAt = c.userChallengeProgresses[0]?.updatedAt;
    const createdAt = c.userChallengeProgresses[0]?.createdAt;

    let status: ChallengeStatus;
    switch (c.challengeType) {
      case 'ONCE':
        status = hasClaim
          ? 'CLAIMED'
          : progress >= 1
            ? 'ACHIEVABLE'
            : 'INCOMPLETE';
        break;
      case 'STREAK': {
        const lastUpdated = updatedAt
          ? dayjs(updatedAt).tz('Asia/Seoul')
          : null;
        // "7일 누적 연속 퀴즈 제출을 완료한 당일"만 허용 yesterday -> today
        const isStreakValid = lastUpdated?.isSame(today, 'day');

        if (hasClaim) {
          status = 'CLAIMED';
        } else if (progress >= 7 && isStreakValid) {
          status = 'ACHIEVABLE';
        } else {
          status = 'INCOMPLETE';
        }
        break;
      }
      case 'DAILY': {
        const claimedToday = c.userChallengeClaims.some((cl) =>
          today.isSame(dayjs(cl.claimDate).tz('Asia/Seoul'), 'day')
        );

        const updatedAtDay = updatedAt
          ? dayjs(updatedAt).tz('Asia/Seoul')
          : null;
        const createdAtDay = createdAt
          ? dayjs(createdAt).tz('Asia/Seoul')
          : null;

        const isUpdatedToday = updatedAtDay?.isSame(today, 'day');
        const isCreatedToday = createdAtDay?.isSame(today, 'day');

        if (claimedToday) {
          status = 'CLAIMED';
        } else if (progress > 0 && (isUpdatedToday || isCreatedToday)) {
          status = 'ACHIEVABLE';
        } else {
          status = 'INCOMPLETE';
        }
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
