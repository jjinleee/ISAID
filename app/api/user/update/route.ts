import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt, { hash } from 'bcryptjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userIdStr = session.user.id;
  if (!userIdStr) {
    return NextResponse.json(
      { error: 'Invalid session user id' },
      { status: 400 }
    );
  }
  const userId = BigInt(userIdStr);

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
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
      if (value !== undefined && key !== 'password' && key !== 'oldPinCode') {
        data[key] = value;
      }
    }

    if ('pinCode' in body) {
      if (!existingUser.pinCode) {
        return NextResponse.json(
          { error: '기존 핀코드가 설정되어 있지 않습니다.' },
          { status: 400 }
        );
      }
      const isPinCodeValid = await bcrypt.compare(
        body.oldPinCode,
        existingUser.pinCode
      );
      if (!body.oldPinCode || !isPinCodeValid) {
        return NextResponse.json(
          { error: '기존 핀코드가 일치하지 않습니다.' },
          { status: 400 }
        );
      }

      // if (!/^\d{6}$/.test(body.pinCode)) {
      //   return NextResponse.json(
      //     { error: '새 핀코드는 6자리 숫자여야 합니다.' },
      //     { status: 400 }
      //   );
      // }

      data.pinCode = await hash(body.pinCode, 10);
    }

    if (body.password !== undefined) {
      data.password = await hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({ message: '정보 수정 완료' });
  } catch (error: any) {
    return NextResponse.json(
      { error: '수정 실패: ' + error.message },
      { status: 500 }
    );
  }
}
