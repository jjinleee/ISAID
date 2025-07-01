import { getTodayStartOfKST } from '@/utils/date';
import type { Prisma } from '@prisma/client';
import type { PrismaTransaction } from '@/lib/prisma';

export type ClaimChallengeParams = {
  challengeId: bigint;
  userId: bigint;
};

export type ClaimChallengeResult = {
  success: boolean;
  message: string;
  transactionId?: bigint;
};

/**
 * 챌린지 보상 수령 비즈니스 로직
 */
export async function claimChallengeReward(
  params: ClaimChallengeParams,
  tx: PrismaTransaction
): Promise<ClaimChallengeResult> {
  const { challengeId, userId } = params;

  // 1. 챌린지 정보 조회
  const challenge = await tx.challenge.findUnique({
    where: { id: challengeId },
    include: { etf: true },
  });

  if (!challenge) {
    return { success: false, message: 'Challenge not found' };
  }

  // 2. 사용자 ISA 계좌 확인
  const user = await tx.user.findUnique({
    where: { id: userId },
    include: { isaAccount: true },
  });

  if (!user?.isaAccount?.id) {
    return { success: false, message: 'ISA account not found' };
  }

  const isaAccountId = user.isaAccount.id;

  // 3. 최신 ETF 종가 조회
  const latestTrading = await tx.etfDailyTrading.findFirst({
    where: { etfId: challenge.etfId },
    orderBy: { baseDate: 'desc' },
  });

  if (!latestTrading?.tddClosePrice) {
    return { success: false, message: 'Latest ETF price not found' };
  }

  const now = new Date();
  const utcMidnight = getTodayStartOfKST();

  // 4. 보상 수령 처리
  // 4-1. 수령 기록 저장
  await tx.userChallengeClaim.create({
    data: {
      userId,
      challengeId,
      claimDate: utcMidnight,
    },
  });

  // 4-2. 진행도 초기화 (ONCE 타입 제외)
  if (challenge.challengeType !== 'ONCE') {
    await tx.userChallengeProgress.updateMany({
      where: { userId, challengeId },
      data: { progressVal: 0 },
    });
  }

  // 4-3. ETF 거래 기록 생성
  const transaction = await tx.eTFTransaction.create({
    data: {
      isaAccountId,
      etfId: challenge.etfId,
      quantity: challenge.quantity,
      transactionType: 'CHALLENGE_REWARD',
      price: latestTrading.tddClosePrice,
      transactionAt: now,
    },
  });

  // 4-4. ETF 보유량 업데이트
  const existingHolding = await tx.eTFHolding.findUnique({
    where: {
      isaAccountId_etfId: {
        isaAccountId,
        etfId: challenge.etfId,
      },
    },
  });

  let avgCost: Prisma.Decimal;

  if (existingHolding) {
    const totalQuantity = existingHolding.quantity.add(challenge.quantity);
    const totalCost = existingHolding.avgCost
      .mul(existingHolding.quantity)
      .add(challenge.quantity.mul(latestTrading.tddClosePrice));
    avgCost = totalCost.div(totalQuantity);
  } else {
    avgCost = latestTrading.tddClosePrice;
  }

  await tx.eTFHolding.upsert({
    where: {
      isaAccountId_etfId: {
        isaAccountId,
        etfId: challenge.etfId,
      },
    },
    update: {
      quantity: { increment: challenge.quantity },
      avgCost: avgCost,
      updatedAt: now,
    },
    create: {
      isaAccountId,
      etfId: challenge.etfId,
      quantity: challenge.quantity,
      avgCost: avgCost,
      acquiredAt: now,
      updatedAt: now,
    },
  });

  return {
    success: true,
    message: 'Reward claimed successfully',
    transactionId: transaction.id,
  };
}
