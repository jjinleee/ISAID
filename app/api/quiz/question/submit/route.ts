import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { updateStreakProgress } from '@/services/challenge/streakChallengeProgress';
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
    await updateStreakProgress(userId, streakChallenge.id);
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
        progressVal: 1,
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
