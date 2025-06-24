'use server';

import { getServerSession } from 'next-auth';
import dayjs from 'dayjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export type ChallengeStatus = 'CLAIMED' | 'ACHIEVABLE' | 'INCOMPLETE';

export type ChallengeInfo = {
  id: bigint;
  issueName: string;
  title: string;
  challengeDescription: string;
  quantity: number;
  status: ChallengeStatus;
};

export async function getChallenges(): Promise<ChallengeInfo[]> {
  // 1) 세션에서 userId 가져오기
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');
  const userId = BigInt(session.user.id);

  const today = dayjs().startOf('day');

  // 2) 모든 챌린지와 해당 유저의 claim 이력 조회
  const rows = await prisma.challenge.findMany({
    select: {
      id: true,
      title: true,
      challengeDescription: true,
      quantity: true,
      challengeType: true,
      targetval: true, // progress count or goal
      etf: { select: { issueName: true } },
      userChallengeClaims: {
        where: { userId },
        select: { claimDate: true },
      },
    },
  });

  // 3) 상태 계산
  return rows.map((c) => {
    const claims = c.userChallengeClaims;
    const hasAnyClaim = claims.length > 0;
    const target = c.targetval ?? 0;

    let status: ChallengeStatus;

    switch (c.challengeType) {
      case 'ONCE':
        // 단발형: 한 번만 수행
        if (hasAnyClaim) {
          status = 'CLAIMED';
        } else if (target >= 1) {
          status = 'ACHIEVABLE';
        } else {
          status = 'INCOMPLETE';
        }
        break;

      case 'STREAK':
        // 연속형: 매일 퀴즈 등으로 누적된 연속일 수가 7 이상일 때
        if (hasAnyClaim) {
          status = 'CLAIMED';
        } else if (target >= 7) {
          status = 'ACHIEVABLE';
        } else {
          status = 'INCOMPLETE';
        }
        break;

      case 'DAILY':
        // 데일리형: 오늘만 체크
        const claimedToday = claims.some((rc) =>
          today.isSame(dayjs(rc.claimDate), 'day')
        );
        if (claimedToday) {
          status = 'CLAIMED';
        } else if (target > 0) {
          status = 'ACHIEVABLE';
        } else {
          status = 'INCOMPLETE';
        }
        break;

      default:
        status = 'INCOMPLETE';
    }

    return {
      id: Number(c.id),
      issueName: c.etf.issueName ?? '',
      title: c.title,
      challengeDescription: c.challengeDescription,
      quantity: Number(c.quantity),
      status,
    };
  });
}
