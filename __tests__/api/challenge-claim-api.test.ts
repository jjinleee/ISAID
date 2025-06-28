/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { resetWithChallengePrismaMock } from '@/__mocks__/prisma';
import { POST } from '@/app/api/challenge/claim/route';
import { claimChallengeReward } from '@/services/challenge/challenge-claim';
import { canClaimChallenge } from '@/services/challenge/challenge-status';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/services/challenge/challenge-status');
jest.mock('@/services/challenge/challenge-claim');
jest.mock('@/lib/prisma', () => {
  const { getPrismaMock } = require('@/__mocks__/prisma');
  return {
    get prisma() {
      return getPrismaMock();
    },
  };
});

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockCanClaimChallenge = canClaimChallenge as jest.MockedFunction<
  typeof canClaimChallenge
>;
const mockClaimChallengeReward = claimChallengeReward as jest.MockedFunction<
  typeof claimChallengeReward
>;

describe('/api/challenge/claim', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = resetWithChallengePrismaMock();
  });

  describe('POST', () => {
    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new Request('http://localhost/api/challenge/claim', {
        method: 'POST',
        body: JSON.stringify({ challengeId: '1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });

    it('should return 400 when challengeId is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1' },
      });

      const request = new Request('http://localhost/api/challenge/claim', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Challenge ID is required');
    });

    it('should successfully claim challenge reward', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1' },
      });

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = mockPrisma;
        return await callback(mockTx);
      });

      mockCanClaimChallenge.mockResolvedValue({ canClaim: true });
      mockClaimChallengeReward.mockResolvedValue({
        success: true,
        message: 'Reward claimed successfully',
        transactionId: BigInt(123),
      });

      const request = new Request('http://localhost/api/challenge/claim', {
        method: 'POST',
        body: JSON.stringify({ challengeId: '1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Reward claimed successfully');
      expect(data.transactionId).toBe('123');

      expect(mockCanClaimChallenge).toHaveBeenCalledWith(
        BigInt(1),
        BigInt(1),
        mockPrisma
      );
      expect(mockClaimChallengeReward).toHaveBeenCalledWith(
        { challengeId: BigInt(1), userId: BigInt(1) },
        mockPrisma
      );
    });

    it('should return 500 when cannot claim challenge', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1' },
      });

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = mockPrisma;
        return await callback(mockTx);
      });

      mockCanClaimChallenge.mockResolvedValue({
        canClaim: false,
        reason: 'Already claimed',
      });

      const request = new Request('http://localhost/api/challenge/claim', {
        method: 'POST',
        body: JSON.stringify({ challengeId: '1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Already claimed');
    });

    it('should return 400 when claim service returns failure', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1' },
      });

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = mockPrisma;
        return await callback(mockTx);
      });

      mockCanClaimChallenge.mockResolvedValue({ canClaim: true });
      mockClaimChallengeReward.mockResolvedValue({
        success: false,
        message: 'ISA account not found',
      });

      const request = new Request('http://localhost/api/challenge/claim', {
        method: 'POST',
        body: JSON.stringify({ challengeId: '1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('ISA account not found');
    });

    it('should handle unexpected errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1' },
      });

      mockPrisma.$transaction.mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost/api/challenge/claim', {
        method: 'POST',
        body: JSON.stringify({ challengeId: '1' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Database error');
    });
  });
});
