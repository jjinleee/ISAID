import { prisma } from '@/lib/prisma';

/**
 * 이메일로 사용자 조회
 * @param email - 사용자의 이메일
 * @returns 유저 객체 or null
 */
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
};
