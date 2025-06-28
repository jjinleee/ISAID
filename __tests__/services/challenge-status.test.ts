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
    it('should return CLAIMED when challenge is already claimed', () => {
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

    it('should return ACHIEVABLE for ONCE type when progress >= 1', () => {
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

    it('should return INCOMPLETE for ONCE type when progress < 1', () => {
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

    it('should return ACHIEVABLE for STREAK type when progress >= 7 and updated today', () => {
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

    it('should return INCOMPLETE for STREAK type when progress >= 7 but not updated today', () => {
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

    it('should return ACHIEVABLE for DAILY type when progress > 0 and updated today', () => {
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

    it('should return ACHIEVABLE for DAILY type when progress > 0 and created today', () => {
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

    it('should return CLAIMED for DAILY type when already claimed today', () => {
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

    it('should return INCOMPLETE for DAILY type when progress = 0 even if updated today', () => {
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

    it('should return INCOMPLETE if no progress data exists', () => {
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

    it('should return false when challenge not found', async () => {
      mockTx.challenge.findUnique.mockResolvedValue(null);

      const result = await canClaimChallenge(BigInt(1), userId, mockTx);

      expect(result.canClaim).toBe(false);
      expect(result.reason).toBe('Challenge not found');
    });

    it('should return false when already claimed', async () => {
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

    it('should return true when challenge is achievable', async () => {
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

    it('should return false when challenge is not completed', async () => {
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
