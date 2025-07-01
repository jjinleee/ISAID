import { createChallengePrismaMock } from '@/__mocks__/prisma-factory';
import {
  calculateChallengeStatus,
  canClaimChallenge,
  type ChallengeWithProgress,
} from '@/services/challenge/challenge-status';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('Challenge Status Service', () => {
  const userId = BigInt(1);
  const today = dayjs().tz('Asia/Seoul').startOf('day');

  describe('calculateChallengeStatus', () => {
    it('이미 보상을 수령한 챌린지는 CLAIMED를 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [{ claimDate: new Date() }],
        userChallengeProgresses: [
          { progressVal: 1, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('CLAIMED');
    });

    it('ONCE 타입 챌린지는 진행도가 1 이상이면 ACHIEVABLE을 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [],
        userChallengeProgresses: [
          { progressVal: 1, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('ACHIEVABLE');
    });

    it('ONCE 타입 챌린지는 진행도가 1 미만이면 INCOMPLETE를 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [],
        userChallengeProgresses: [
          { progressVal: 0, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('INCOMPLETE');
    });

    it('STREAK 타입 챌린지는 진행도 7 이상이고 오늘 갱신됐으면 ACHIEVABLE을 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'STREAK',
        userChallengeClaims: [],
        userChallengeProgresses: [
          {
            progressVal: 7,
            createdAt: new Date(),
            updatedAt: today.toDate(),
          },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('ACHIEVABLE');
    });

    it('STREAK 타입 챌린지는 진행도 7 이상이어도 오늘 갱신되지 않았으면 INCOMPLETE를 반환한다', () => {
      const yesterday = today.subtract(1, 'day');
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'STREAK',
        userChallengeClaims: [],
        userChallengeProgresses: [
          {
            progressVal: 7,
            createdAt: new Date(),
            updatedAt: yesterday.toDate(),
          },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('INCOMPLETE');
    });

    it('DAILY 타입 챌린지는 진행도가 0보다 크고 오늘 갱신됐으면 ACHIEVABLE을 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'DAILY',
        userChallengeClaims: [],
        userChallengeProgresses: [
          {
            progressVal: 1,
            createdAt: new Date(),
            updatedAt: today.toDate(),
          },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('ACHIEVABLE');
    });

    it('DAILY 타입 챌린지는 진행도가 0보다 크고 오늘 생성됐으면 ACHIEVABLE을 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'DAILY',
        userChallengeClaims: [],
        userChallengeProgresses: [
          {
            progressVal: 1,
            createdAt: today.toDate(),
            updatedAt: null,
          },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('ACHIEVABLE');
    });

    it('DAILY 타입 챌린지는 오늘 이미 보상을 수령했으면 CLAIMED를 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'DAILY',
        userChallengeClaims: [{ claimDate: today.toDate() }],
        userChallengeProgresses: [
          {
            progressVal: 1,
            createdAt: new Date(),
            updatedAt: today.toDate(),
          },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('CLAIMED');
    });

    it('DAILY 타입 챌린지는 진행도가 0이면 오늘 갱신됐더라도 INCOMPLETE를 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'DAILY',
        userChallengeClaims: [],
        userChallengeProgresses: [
          {
            progressVal: 0,
            createdAt: new Date(),
            updatedAt: today.toDate(),
          },
        ],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('INCOMPLETE');
    });

    it('진행도 정보가 없으면 INCOMPLETE를 반환한다', () => {
      const challenge: ChallengeWithProgress = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [],
        userChallengeProgresses: [],
      };

      const status = calculateChallengeStatus(challenge, userId);
      expect(status).toBe('INCOMPLETE');
    });
  });

  describe('canClaimChallenge', () => {
    let mockTx: any;

    beforeEach(() => {
      mockTx = createChallengePrismaMock();
    });

    it('챌린지를 찾을 수 없으면 false를 반환하고 이유를 제공한다', async () => {
      mockTx.challenge.findUnique.mockResolvedValue(null);

      const result = await canClaimChallenge(BigInt(1), userId, mockTx);

      expect(result.canClaim).toBe(false);
      expect(result.reason).toBe('Challenge not found');
    });

    it('이미 보상을 수령한 챌린지는 false를 반환하고 이유를 제공한다', async () => {
      const mockChallenge = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [{ claimDate: new Date() }],
        userChallengeProgresses: [
          { progressVal: 1, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);

      const result = await canClaimChallenge(BigInt(1), userId, mockTx);

      expect(result.canClaim).toBe(false);
      expect(result.reason).toBe('Already claimed');
    });

    it('보상이 가능한 챌린지는 true를 반환한다', async () => {
      const mockChallenge = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [],
        userChallengeProgresses: [
          { progressVal: 1, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);

      const result = await canClaimChallenge(BigInt(1), userId, mockTx);

      expect(result.canClaim).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('완료되지 않은 챌린지는 false를 반환하고 이유를 제공한다', async () => {
      const mockChallenge = {
        id: BigInt(1),
        challengeType: 'ONCE',
        userChallengeClaims: [],
        userChallengeProgresses: [
          { progressVal: 0, createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);

      const result = await canClaimChallenge(BigInt(1), userId, mockTx);

      expect(result.canClaim).toBe(false);
      expect(result.reason).toBe('Challenge not completed');
    });
  });
});
