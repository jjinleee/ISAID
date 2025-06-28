/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/isa/rebalancing/route';

// 모킹 설정
jest.mock('next-auth');
jest.mock('@/services/isa/rebalancing-service', () => ({
  RebalancingService: jest.fn(),
  InvestmentProfileNotFoundError: class InvestmentProfileNotFoundError extends Error {
    constructor() {
      super('투자 성향 정보가 없습니다.');
      this.name = 'InvestmentProfileNotFoundError';
    }
  },
  ISAAccountNotFoundError: class ISAAccountNotFoundError extends Error {
    constructor() {
      super('ISA 계좌 정보가 없습니다.');
      this.name = 'ISAAccountNotFoundError';
    }
  },
}));

const mockRebalancingService = {
  getRebalancingRecommendation: jest.fn(),
};

const {
  RebalancingService,
  InvestmentProfileNotFoundError,
  ISAAccountNotFoundError,
} = require('@/services/isa/rebalancing-service');

(RebalancingService as jest.Mock).mockImplementation(
  () => mockRebalancingService
);

describe('GET /api/isa/rebalancing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('인증 테스트', () => {
    it('인증되지 않은 사용자는 401 에러를 반환한다', async () => {
      // Given
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // When
      const req = new NextRequest('http://localhost:3000/api/isa/rebalancing');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(401);
      expect(json.message).toBe('인증되지 않은 사용자입니다.');
    });

    it('세션에 사용자 ID가 없으면 401 에러를 반환한다', async () => {
      // Given
      (getServerSession as jest.Mock).mockResolvedValue({
        user: {},
      });

      // When
      const req = new NextRequest('http://localhost:3000/api/isa/rebalancing');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(401);
      expect(json.message).toBe('인증되지 않은 사용자입니다.');
    });
  });

  describe('서비스 로직 테스트', () => {
    beforeEach(() => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '123' },
      });
    });

    it('투자 성향 정보가 없으면 404 에러를 반환한다', async () => {
      // Given
      mockRebalancingService.getRebalancingRecommendation.mockRejectedValue(
        new InvestmentProfileNotFoundError()
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/isa/rebalancing');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(404);
      expect(json.message).toBe('투자 성향 정보가 없습니다.');
      expect(
        mockRebalancingService.getRebalancingRecommendation
      ).toHaveBeenCalledWith(BigInt('123'));
    });

    it('ISA 계좌 정보가 없으면 404 에러를 반환한다', async () => {
      // Given
      mockRebalancingService.getRebalancingRecommendation.mockRejectedValue(
        new ISAAccountNotFoundError()
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/isa/rebalancing');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(404);
      expect(json.message).toBe('ISA 계좌 정보가 없습니다.');
    });

    it('성공적으로 리밸런싱 추천 결과를 반환한다', async () => {
      // Given
      const mockResult = {
        recommendedPortfolio: [
          { category: '국내 주식', percentage: 25 },
          { category: '해외 주식', percentage: 25 },
          { category: '채권', percentage: 40 },
          { category: 'ELS', percentage: 5 },
          { category: '펀드', percentage: 5 },
        ],
        score: 85.5,
        rebalancingOpinions: [
          {
            category: '국내 주식',
            userPercentage: 30,
            recommendedPercentage: 25,
            opinion: '비중 축소 필요',
            detail: '국내 주식 비중이 권장수준보다 5.0%p 높습니다.',
          },
          {
            category: '해외 주식',
            userPercentage: 20,
            recommendedPercentage: 25,
            opinion: '비중 확대 필요',
            detail:
              '해외 주식 비중이 권장수준보다 5.0%p 낮습니다. 해당 자산군에 대한 투자를 늘리는 것을 추천합니다.',
          },
        ],
      };

      mockRebalancingService.getRebalancingRecommendation.mockResolvedValue(
        mockResult
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/isa/rebalancing');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(200);
      expect(json).toEqual(mockResult);
      expect(
        mockRebalancingService.getRebalancingRecommendation
      ).toHaveBeenCalledWith(BigInt('123'));
    });

    it('예상치 못한 에러가 발생하면 500 에러를 반환한다', async () => {
      // Given
      mockRebalancingService.getRebalancingRecommendation.mockRejectedValue(
        new Error('예상치 못한 에러')
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/isa/rebalancing');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(500);
      expect(json.message).toBe('서버 오류가 발생했습니다.');
    });
  });
});
