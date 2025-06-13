import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await prisma.user.delete({
    where: {
      email: session.user.email,
    },
  });

  return NextResponse.json({ message: 'User deleted successfully' });
}