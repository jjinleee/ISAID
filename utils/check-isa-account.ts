import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

/**
 * 현재 로그인한 사용자의 ISA 계좌 존재 여부를 반환합니다.
 * @returns {Promise<boolean>} ISA 계좌가 있으면 true, 없으면 false
 */
export default async function checkIsaAccount(): Promise<boolean> {
  // 1) 세션에서 유저 ID 가져오기
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return false;
  }
  const userId = BigInt(session.user.id);

  // 2) 해당 유저의 ISA 계좌 존재 여부 조회
  const isaAccount = await prisma.iSAAccount.findUnique({
    where: { userId },
    select: { id: true },
  });

  // 3) 있으면 true, 없으면 false
  return isaAccount !== null;
}
