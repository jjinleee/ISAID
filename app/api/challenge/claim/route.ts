import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { claimChallengeReward } from '@/services/challenge/challenge-claim';
import { canClaimChallenge } from '@/services/challenge/challenge-status';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = BigInt(session.user.id);
  const { challengeId } = await req.json();

  if (!challengeId) {
    return NextResponse.json(
      { message: 'Challenge ID is required' },
      { status: 400 }
    );
  }

  const challengeIdBigInt = BigInt(challengeId);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 보상 수령 가능 여부 확인
      const { canClaim, reason } = await canClaimChallenge(
        challengeIdBigInt,
        userId,
        tx
      );

      if (!canClaim) {
        throw new Error(reason || 'Cannot claim reward');
      }

      // 2. 보상 수령 처리
      return await claimChallengeReward(
        { challengeId: challengeIdBigInt, userId },
        tx
      );
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      message: result.message,
      transactionId: result.transactionId?.toString(),
    });
  } catch (error) {
    console.error('Challenge claim error:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
