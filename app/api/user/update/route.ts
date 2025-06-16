import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: '해당 이메일의 사용자가 존재하지 않습니다.' },
      { status: 404 }
    );
  }

  const body = await req.json();

  const forbiddenFields = ['id', 'rrn', 'created_at'];
  for (const field of forbiddenFields) {
    if (field in body) {
      return NextResponse.json(
        { error: `변경할 수 없는 필드가 포함되어 있습니다: ${field}` },
        { status: 400 }
      );
    }
  }

  try {
    const data: any = {};

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && key !== 'password') {
        data[key] = value;
      }
    }

    if (body.password !== undefined) {
      data.password = await hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data,
    });

    return NextResponse.json({ message: '정보 수정 완료', user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: '수정 실패: ' + error.message },
      { status: 500 }
    );
  }
}
