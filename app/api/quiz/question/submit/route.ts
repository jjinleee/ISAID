import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

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

  //KST 기준으로 해야함
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstDateOnly = new Date(
    kstNow.getFullYear(),
    kstNow.getMonth(),
    kstNow.getDate()
  );

  await prisma.quizCalendar.upsert({
    where: {
      userId_solvedDate: {
        userId,
        solvedDate: kstDateOnly,
      },
    },
    update: {},
    create: {
      userId,
      solvedDate: kstDateOnly,
    },
  });

  console.log('QUIZ 저장:', {
    userId: userId.toString(),
    date: kstDateOnly.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
  });
  return NextResponse.json({
    isCorrect,
    correctAnswerId: correct.id.toString(),
  });
}
