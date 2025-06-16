import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { password } = body;

  const existingUser = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (!existingUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const passwordMatch = await compare(password, existingUser.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
  }

  await prisma.user.delete({
    where: {
      id: existingUser.id,
    },
  });

  return NextResponse.json({ message: 'User deleted successfully' });
}
