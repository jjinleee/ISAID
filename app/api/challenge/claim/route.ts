import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

dayjs.extend(utc);
dayjs.extend(timezone);

function getTodayStartOfKST() {
  return dayjs().tz('Asia/Seoul').startOf('day').utc().toDate();
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = BigInt(session.user.id);
  const { challengeId } = await req.json();

  // 챌린지 정보 불러오기 (유형 포함)
  const challenge = await prisma.challenge.findUniqueOrThrow({
    where: { id: challengeId },
    include: { etf: true },
  });
  //console.log('Challenge fetched:', challenge.id, challenge.challengeType);

  // 수령 여부 확인
  const existingClaim = await prisma.userChallengeClaim.findFirst({
    where: {
      userId,
      challengeId,
    },
  });
  // console.log('Existing claim:', !!existingClaim);

  //이미 받았음
  if (existingClaim) {
    return NextResponse.json({ message: 'Already claimed' }, { status: 400 });
  }

  // 보상 수령일: 오늘 자정 (UTC)
  const now = new Date();
  const utcMidnight = getTodayStartOfKST();

  const latestPrice = await prisma.etfDailyTrading.findFirst({
    where: { etfId: challenge.etfId },
    orderBy: { baseDate: 'desc' },
    select: { tddClosePrice: true },
  });

  if (latestPrice?.tddClosePrice) {
    //const expectedCost = challenge.quantity.mul(latestPrice.tddClosePrice)
    //console.log('✅ 검증용 expected avgCost:', expectedCost.toFixed(2))
  }

  //트랜잭션 처리
  await prisma.$transaction(async (tx) => {
    // 1. 수령 기록 저장
    await tx.userChallengeClaim.create({
      data: {
        userId,
        challengeId,
        claimDate: utcMidnight,
      },
    });
    //console.log(' 📍Claim record created for user:', userId.toString(), 'challenge:', challengeId.toString());

    // 2. 진행도 초기화
    if (challenge.challengeType !== 'ONCE') {
      await tx.userChallengeProgress.updateMany({
        where: { userId, challengeId },
        data: { progressVal: 0 },
      });
      //console.log('Progress reset for user:', userId.toString(), 'challenge:', challengeId.toString());
    }

    // 3. 보상 지급 처리
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      include: { isaAccount: true },
    });
    const isaAccountId = user.isaAccount?.id;
    //console.log('📍User fetched with ISA account:', isaAccountId?.toString());

    if (!isaAccountId) throw new Error('ISA 계좌가 없습니다');

    // ETF daily trading 에서 가장 최신 종가
    const latestTrading = await tx.etfDailyTrading.findFirst({
      where: { etfId: challenge.etfId },
      orderBy: { baseDate: 'desc' },
    });
    //console.log("최신종가 : ", latestTrading);

    if (!latestTrading?.tddClosePrice) {
      throw new Error('최신 종가 정보를 찾을 수 없습니다');
    }

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
    //console.log('Transaction created:', transaction);

    //최신종가 * 지급수량
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
      //console.log('📌 Adjusted avgCost for existing holding:', avgCost.toFixed(2))
    } else {
      avgCost = latestTrading.tddClosePrice;
      //console.log('📌 New holding avgCost (latest price):', avgCost.toFixed(2))
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
    //console.log('ETF holding updated or created');
  });

  return NextResponse.json({ message: 'Reward claimed successfully' });
}
