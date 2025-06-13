import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { name, eng_name, phone, address, telno } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        eng_name,
        phone,
        address,
        telno,
      },
    });

    return NextResponse.json({ message: '정보 수정 완료', user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: '수정 실패: ' + error.message }, { status: 500 });
  }
}