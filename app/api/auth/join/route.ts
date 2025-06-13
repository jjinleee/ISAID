import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, eng_name, email, password, rrn, phone, address, telno } =
      data;

    if (!name || !email || !password || !rrn || !phone || !address) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 중복 이메일 체크
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        eng_name,
        email,
        password: hashedPassword,
        rrn,
        phone,
        address,
        telno,
      },
    });

    return NextResponse.json(
      { message: '회원가입 성공', user_id: newUser.user_id },
      { status: 201 }
    );
    // build error : Warning: Unexpected any. Specify a different type
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
