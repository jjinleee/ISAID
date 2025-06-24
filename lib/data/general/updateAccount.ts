import { prisma } from '@/lib/prisma';

export const updateCurrentBalance = async (isaAccountId: bigint) => {
  const updatedAccount = await prisma.iSAAccount.update({
    where: {
      id: isaAccountId,
    },
    data: {
      currentBalance: 10184805,
    },
  });

  return updatedAccount;
};
