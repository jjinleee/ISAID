import {
  checkFirstIsaAccount,
  checkHoldAccount500Days,
  checkHoldEtf3Plus,
  checkYearlyDeposit,
} from '@/services/challenge/check';
import { insertUserChallengeProgress } from '@/services/challenge/progress';
import { ChallengeCodes } from '@/types/challenge';
import { prisma } from '@/lib/prisma';

export async function applyIsaChallengeProgress(userId: bigint) {
  const tx = prisma; // 트랜잭션이 필요 없다면 prisma 자체로 사용

  const checks = [
    { code: ChallengeCodes.FIRST_CONNECT_ISA, fn: checkFirstIsaAccount },
    { code: ChallengeCodes.HOLD_ETF_3PLUS, fn: checkHoldEtf3Plus },
    { code: ChallengeCodes.HOLD_ACCOUNT_500DAYS, fn: checkHoldAccount500Days },
    { code: ChallengeCodes.YEARLY_DEPOSIT, fn: checkYearlyDeposit },
  ];

  for (const { code, fn } of checks) {
    const isCompleted = await fn(userId, tx);
    if (isCompleted) {
      await insertUserChallengeProgress(tx, userId, code);
    }
  }
}
