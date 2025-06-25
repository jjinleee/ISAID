import { differenceInDays } from 'date-fns';
import { PrismaTransaction } from '@/lib/prisma';

export async function checkFirstInvestTest(
  userId: bigint,
  tx: PrismaTransaction
): Promise<boolean> {
  const profile = await tx.investmentProfile.findUnique({
    where: { userId },
  });
  return profile !== null;
}

export async function checkFirstIsaAccount(
  userId: bigint,
  tx: PrismaTransaction
): Promise<boolean> {
  const isa = await tx.iSAAccount.findUnique({ where: { userId } });
  return !!isa;
}

export async function checkHoldEtf3Plus(
  userId: bigint,
  tx: PrismaTransaction
): Promise<boolean> {
  const isaAccount = await tx.iSAAccount.findUnique({
    where: { userId },
    include: {
      etfHoldings: true,
    },
  });

  if (!isaAccount) return false;

  return isaAccount.etfHoldings.length >= 3;
}

export async function checkHoldAccount500Days(
  userId: bigint,
  tx: PrismaTransaction
): Promise<boolean> {
  const isa = await tx.iSAAccount.findUnique({
    where: { userId },
    select: { connectedAt: true },
  });

  if (!isa?.connectedAt) return false;

  const today = new Date(); // UTC 기준
  const daysHeld = differenceInDays(today, isa.connectedAt);

  return daysHeld >= 500;
}

export async function checkYearlyDeposit(
  userId: bigint,
  tx: PrismaTransaction
): Promise<boolean> {
  const isa = await tx.iSAAccount.findUnique({
    where: { userId },
    select: { paymentAmount: true },
  });

  if (!isa?.paymentAmount) return false;

  return isa.paymentAmount >= 1_000_000;
}
