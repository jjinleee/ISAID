import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

// 정확히 'KST 기준 오늘 자정'을 UTC로 계산
function getTodayStartOfKST() {
  const now = new Date();

  // 오늘의 KST 자정은 UTC 기준 15:00 of 전날
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();

  const kstStartToday = new Date(
    Date.UTC(utcYear, utcMonth, utcDate, 15, 0, 0)
  );
  const kstStartYesterday = new Date(
    kstStartToday.getTime() - 24 * 60 * 60 * 1000
  );

  // 현재 시간이 KST 자정 이후면 오늘 자정 기준 사용
  return now >= kstStartToday ? kstStartToday : kstStartYesterday;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = BigInt(session.user.id);
  const { questionId, selectedId } = await req.json();

  const correct = await prisma.selection.findFirst({
    where: {
      questionId: BigInt(questionId),
      answerFlag: true,
    },
  });

  if (!correct) {
    return NextResponse.json(
      { message: 'Correct answer not found' },
      { status: 404 }
    );
  }

  const isCorrect = correct.id.toString() === selectedId.toString();

  // 정확한 출석 날짜 계산 (KST 자정 기준)
  const solvedDate = getTodayStartOfKST();

  //중복 방지 upsert
  await prisma.quizCalendar.upsert({
    where: {
      userId_solvedDate: {
        userId,
        solvedDate,
      },
    },
    update: {},
    create: {
      userId,
      solvedDate,
    },
  });

  // DAILY 챌린지 수령 처리 (QUIZ_DAILY)
  const quizChallenge = await prisma.challenge.findUnique({
    where: { code: 'QUIZ_DAILY' },
  });

  // STREAK 챌린지 진행도 증가 (ATTEND_7DAY)
  const streakChallenge = await prisma.challenge.findUnique({
    where: { code: 'ATTEND_7DAY' },
  });

  if (streakChallenge) {
    await prisma.userChallengeProgress.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId: streakChallenge.id,
        },
      },
      create: {
        userId,
        challengeId: streakChallenge.id,
        progressVal: 1,
      },
      update: {
        progressVal: {
          increment: 1,
        },
      },
    });
  }

  if (quizChallenge) {
    await prisma.userChallengeProgress.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId: quizChallenge.id,
        },
      },
      create: {
        userId,
        challengeId: quizChallenge.id,
        progressVal: 1,
      },
      update: {
        progressVal: {
          increment: 1,
        },
      },
    });
  }

  console.log('QUIZ 저장:', {
    userId: userId.toString(),
    solvedDate: solvedDate.toISOString(), // 항상 15:00:00Z 형식으로 저장됨
  });

  return NextResponse.json({
    isCorrect,
    correctAnswerId: correct.id.toString(),
  });
}
