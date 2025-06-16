import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ISA 계좌 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id, //db수정후 삭제
      userId,
      bankCode,
      accountNum,
      currentBalance,
      accountType,
      accountKind,
    } = body;

    const existing = await prisma.isaAccount.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json(
        { message: '이미 ISA 계좌가 존재합니다.' },
        { status: 400 }
      );
    }

    const newAccount = await prisma.isaAccount.create({
      data: {
        id, //db수정후 삭제
        userId,
        bankCode,
        accountNum,
        connectedAt: new Date(),
        currentBalance,
        accountType,
        accountKind,
      },
    });

    return NextResponse.json({
      message: 'ISA 계좌 등록 성공',
      isaAccountId: newAccount.id,
    });
  } catch (error) {
    console.error('ISA 등록 오류:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

// ISA 계좌 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return NextResponse.json(
        { message: 'userId 쿼리 필요' },
        { status: 400 }
      );
    }

    const isa = await prisma.isaAccount.findUnique({ where: { userId } });

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
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return NextResponse.json(
        { message: 'userId 쿼리 필요' },
        { status: 400 }
      );
    }

    await prisma.isaAccount.delete({ where: { userId } });

    return NextResponse.json({ message: 'ISA 계좌 삭제 성공' });
  } catch (error) {
    console.error('ISA 삭제 오류:', error);
    return NextResponse.json(
      { message: '서버 오류 또는 계좌 없음' },
      { status: 500 }
    );
  }
}
