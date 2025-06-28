import { getTodayStartOfKST, getYesterdayStartOfKST } from '@/utils/date';
import { prisma } from '@/lib/prisma';

/**
 * STREAK 챌린지 진행도 업데이트 (7일 누적 출석 기준)
 */
export async function updateStreakProgress(
  userId: bigint,
  challengeId: bigint
) {
  const todayStart = getTodayStartOfKST();
  const yesterdayStart = getYesterdayStartOfKST();

  // 현재 진행 정보
  const existingProgress = await prisma.userChallengeProgress.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  });

  // 어제 출석이 아니면 1로 리셋
  let progressVal = 1;

  // 연속 출석인지 판단
  if (existingProgress?.updatedAt) {
    const lastUpdated = existingProgress.updatedAt;
    if (yesterdayStart <= lastUpdated && lastUpdated < todayStart) {
      // 어제 출석한 기록이 있으면 연속
      progressVal = existingProgress.progressVal + 1;
    }
  }

  // 업데이트 or 생성
  await prisma.userChallengeProgress.upsert({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
    create: {
      userId,
      challengeId,
      progressVal,
    },
    update: {
      progressVal,
    },
  });
}
