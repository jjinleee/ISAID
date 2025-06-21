import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = BigInt(session.user.id);

  const records = await prisma.quizCalendar.findMany({
    where: {
      userId,
    },
    select: {
      solvedDate: true,
    },
  });

  const solvedDates = records.map((r) =>
    dayjs.utc(r.solvedDate).tz('Asia/Seoul').format('YYYY-MM-DD')
  );

  return NextResponse.json({ solvedDates });
}
