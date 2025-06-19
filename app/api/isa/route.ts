import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

// ISA 계좌 등록
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }
    const userId = BigInt(session.user.id);

    const body = await req.json();
    const { bankCode, accountNum, currentBalance, accountType, accountKind } =
      body;

    const existing = await prisma.iSAAccount.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json(
        { message: '이미 ISA 계좌가 존재합니다.' },
        { status: 400 }
      );
    }

    const newAccount = await prisma.iSAAccount.create({
      data: {
        userId,
        bankCode,
        accountNum,
        connectedAt: new Date(),
        currentBalance,
        accountType,
        paymentAmount: BigInt(1700),
      },
    });

    return NextResponse.json({
      message: 'ISA 계좌 등록 성공',
      isaAccountId: newAccount.id.toString(),
    });
  } catch (error) {
    console.error('ISA 등록 오류:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

// ISA 계좌 조회
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

    const isa = await prisma.iSAAccount.findUnique({ where: { userId } });

    if (!isa) {
      return NextResponse.json({ message: 'ISA 계좌 없음' }, { status: 404 });
    }

    return NextResponse.json(isa);
  } catch (error) {
    console.error('ISA 조회 오류:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

// ISA 계좌 삭제
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }
    const userId = BigInt(session.user.id);

    await prisma.iSAAccount.delete({ where: { userId } });

    return NextResponse.json({ message: 'ISA 계좌 삭제 성공' });
  } catch (error) {
    console.error('ISA 삭제 오류:', error);
    return NextResponse.json(
      { message: '서버 오류 또는 계좌 없음' },
      { status: 500 }
    );
  }
}
