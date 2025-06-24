import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(session.user.id) },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingCalendar = await prisma.quizCalendar.findUnique({
    where: {
      userId_solvedDate: {
        userId: user.id,
        solvedDate: today,
      },
    },
  });

  const totalCount = await prisma.question.count({
    where: {
      selections: {
        some: {},
      },
    },
  });

  if (totalCount === 0) {
    return NextResponse.json(
      { message: 'No questions available' },
      { status: 404 }
    );
  }

  //매일 랜덤값-같은 날, 같은 사용자에게 같은 퀴즈 유지(즉 하루에 한번 변하는 랜덤퀴즈)
  const seed = today.getTime() + Number(user.id); //날짜+사용자 기준으로 랜덤
  const seededIndex = seed % totalCount;

  const question = await prisma.question.findFirst({
    where: {
      selections: {
        some: {},
      },
    },
    skip: seededIndex,
    include: {
      selections: true,
    },
  });
  const correct = await prisma.selection.findFirst({
    where: {
      questionId: question?.id,
      answerFlag: true,
    },
  });

  if (!question) {
    return NextResponse.json({ message: 'No question found' }, { status: 404 });
  }

  if (!existingCalendar) {
    await prisma.quizCalendar.create({
      data: {
        userId: user.id,
        solvedDate: today,
      },
    });
  }

  return NextResponse.json({
    question: {
      ...question,
      id: question.id.toString(),
      selections: question.selections.map((s) => ({
        id: s.id.toString(),
        questionId: s.questionId.toString(),
        content: s.content,
      })),
    },
    correctAnswerId: correct?.id.toString() ?? null,
    alreadySolved: !!existingCalendar,
  });
}
