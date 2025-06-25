import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: '인증 필요' }, { status: 401 });
    }

    const { pinCode } = await req.json();
    const userId = BigInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pinCode: true },
    });

    if (!user) {
      return NextResponse.json({ message: '사용자 없음' }, { status: 404 });
    }

    console.log('입력된 pinCode:', pinCode);
    console.log('DB 해시 앞 10자:', user.pinCode?.slice(0, 10));

    if (!user.pinCode) {
      return NextResponse.json(
        { success: false, error: '핀코드가 설정되어 있지 않습니다.' },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(pinCode, user.pinCode);

    console.log('bcrypt 비교 결과 isValid:', isValid);

    return NextResponse.json({ success: isValid });
  } catch (error) {
    console.error('핀코드 검증 오류:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
