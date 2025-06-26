import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { error: '해당 사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { rewardAgreed: true },
    });

    return NextResponse.json({ message: '보상 동의 완료' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: '알 수 없는 오류 발생' },
      { status: 500 }
    );
  }
}
