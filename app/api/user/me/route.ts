// app/api/user/me/route.ts

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }

    const userId = BigInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        engName: true,
        email: true,
        phone: true,
        address: true,
        telno: true,
        createdAt: true,
        updatedAt: true,
        rewardAgreed: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: '사용자 없음' }, { status: 404 });
    }

    // BigInt -> string 변환
    const serializedUser = {
      ...user,
      id: user.id.toString(),
    };

    return NextResponse.json(serializedUser);
  } catch (error) {
    console.error('유저 조회 오류:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
