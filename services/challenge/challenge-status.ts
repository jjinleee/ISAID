import type {
  Challenge,
  UserChallengeClaim,
  UserChallengeProgress,
} from '@prisma/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { PrismaTransaction } from '@/lib/prisma';

dayjs.extend(utc);
dayjs.extend(timezone);

export type ChallengeStatus = 'CLAIMED' | 'ACHIEVABLE' | 'INCOMPLETE';

/*
export interface ChallengeWithProgress {
  id: bigint
  challengeType: string
  userChallengeClaims: Array<{ claimDate: Date }>
  userChallengeProgresses: Array<{
    progressVal: number
    createdAt: Date
    updatedAt: Date | null
  }>
}
*/

export type ChallengeWithProgress = Pick<Challenge, 'id' | 'challengeType'> & {
  userChallengeClaims: Pick<UserChallengeClaim, 'claimDate'>[];
  userChallengeProgresses: Pick<
    UserChallengeProgress,
    'progressVal' | 'createdAt' | 'updatedAt'
  >[];
};

/**
 * 챌린지 상태를 계산하는 공통 로직
 */
export function calculateChallengeStatus(
  challenge: ChallengeWithProgress,
  userId: bigint
): ChallengeStatus {
  const today = dayjs().tz('Asia/Seoul').startOf('day');

  const hasClaim = challenge.userChallengeClaims.length > 0;
  const progress = challenge.userChallengeProgresses[0]?.progressVal ?? 0;
  const updatedAt = challenge.userChallengeProgresses[0]?.updatedAt;
  const createdAt = challenge.userChallengeProgresses[0]?.createdAt;

  switch (challenge.challengeType) {
    case 'ONCE':
      return hasClaim ? 'CLAIMED' : progress >= 1 ? 'ACHIEVABLE' : 'INCOMPLETE';

    case 'STREAK': {
      const lastUpdated = updatedAt ? dayjs(updatedAt).tz('Asia/Seoul') : null;
      // "7일 누적 연속 퀴즈 제출을 완료한 당일"만 허용
      const isStreakValid = lastUpdated?.isSame(today, 'day');

      if (hasClaim) {
        return 'CLAIMED';
      } else if (progress >= 7 && isStreakValid) {
        return 'ACHIEVABLE';
      } else {
        return 'INCOMPLETE';
      }
    }

    case 'DAILY': {
      const claimedToday = challenge.userChallengeClaims.some((cl) =>
        today.isSame(dayjs(cl.claimDate).tz('Asia/Seoul'), 'day')
      );

      const updatedAtDay = updatedAt ? dayjs(updatedAt).tz('Asia/Seoul') : null;
      const createdAtDay = createdAt ? dayjs(createdAt).tz('Asia/Seoul') : null;

      const isUpdatedToday = updatedAtDay?.isSame(today, 'day');
      const isCreatedToday = createdAtDay?.isSame(today, 'day');

      if (claimedToday) {
        return 'CLAIMED';
      } else if (progress > 0 && (isUpdatedToday || isCreatedToday)) {
        return 'ACHIEVABLE';
      } else {
        return 'INCOMPLETE';
      }
    }

    default:
      return 'INCOMPLETE';
  }
}

/**
 * 챌린지 보상 수령 가능 여부 확인
 */
export async function canClaimChallenge(
  challengeId: bigint,
  userId: bigint,
  tx: PrismaTransaction
): Promise<{ canClaim: boolean; reason?: string }> {
  const challenge = await tx.challenge.findUnique({
    where: { id: challengeId },
    include: {
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

  if (!challenge) {
    return { canClaim: false, reason: 'Challenge not found' };
  }

  const status = calculateChallengeStatus(challenge, userId);

  if (status === 'CLAIMED') {
    return { canClaim: false, reason: 'Already claimed' };
  }

  if (status !== 'ACHIEVABLE') {
    return { canClaim: false, reason: 'Challenge not completed' };
  }

  return { canClaim: true };
}
