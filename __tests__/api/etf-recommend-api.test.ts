/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/etf/recommend/route';

// 모킹 설정
jest.mock('next-auth');
jest.mock('@/services/etf/etf-recommend-service', () => ({
  EtfRecommendService: jest.fn(),
  InvestmentProfileNotFoundError: class InvestmentProfileNotFoundError extends Error {
    constructor() {
      super('투자 성향 테스트를 먼저 완료해주세요.');
      this.name = 'InvestmentProfileNotFoundError';
    }
  },
  NoEtfDataError: class NoEtfDataError extends Error {
    constructor() {
      super('추천할 수 있는 ETF가 없습니다.');
      this.name = 'NoEtfDataError';
    }
  },
  NoTradingDataError: class NoTradingDataError extends Error {
    constructor() {
      super('거래 데이터가 있는 ETF가 없습니다.');
      this.name = 'NoTradingDataError';
    }
  },
}));

const mockEtfRecommendService = {
  getRecommendations: jest.fn(),
};

const {
  EtfRecommendService,
  InvestmentProfileNotFoundError,
  NoEtfDataError,
  NoTradingDataError,
} = require('@/services/etf/etf-recommend-service');

(EtfRecommendService as jest.Mock).mockImplementation(
  () => mockEtfRecommendService
);

describe('GET /api/etf/recommend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('인증 테스트', () => {
    it('인증되지 않은 사용자는 401 에러를 반환한다', async () => {
      // Given
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(401);
      expect(json.message).toBe('인증된 사용자만 접근 가능합니다.');
    });

    it('세션에 사용자 ID가 없으면 401 에러를 반환한다', async () => {
      // Given
      (getServerSession as jest.Mock).mockResolvedValue({
        user: {},
      });

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(401);
      expect(json.message).toBe('인증된 사용자만 접근 가능합니다.');
    });
  });

  describe('서비스 로직 테스트', () => {
    beforeEach(() => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '61' },
      });
    });

    it('투자 성향이 없으면 400 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendService.getRecommendations.mockRejectedValue(
        new InvestmentProfileNotFoundError()
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(400);
      expect(json.message).toBe('투자 성향 테스트를 먼저 완료해주세요.');
      expect(mockEtfRecommendService.getRecommendations).toHaveBeenCalledWith(
        BigInt('61'),
        10
      );
    });

    it('ETF 데이터가 없으면 404 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendService.getRecommendations.mockRejectedValue(
        new NoEtfDataError()
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(404);
      expect(json.message).toBe('추천할 수 있는 ETF가 없습니다.');
    });

    it('거래 데이터가 있는 ETF가 없으면 404 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendService.getRecommendations.mockRejectedValue(
        new NoTradingDataError()
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(404);
      expect(json.message).toBe('거래 데이터가 있는 ETF가 없습니다.');
    });

    it('성공적으로 ETF 추천 결과를 반환한다', async () => {
      // Given
      const mockResult = {
        recommendations: [
          {
            etfId: '1',
            issueCode: 'TEST001',
            issueName: '테스트 ETF',
            category: '주식형',
            score: 85.5,
            riskGrade: 3,
            flucRate: 2.5,
            metrics: {
              sharpeRatio: 1.2,
              totalFee: 0.3,
              tradingVolume: 1000000,
              netAssetValue: 50000000000,
              trackingError: 0.5,
              divergenceRate: 0.2,
              volatility: 0.15,
              normalizedVolatility: 0.6,
            },
            reasons: [
              {
                title: '낮은 총보수',
                description: '0.3%의 낮은 총보수로 비용 효율성이 우수합니다.',
              },
            ],
          },
        ],
        userProfile: {
          investType: 'MODERATE',
          totalEtfsAnalyzed: 100,
          filteredEtfsCount: 50,
        },
        weights: {
          sharpeRatio: 0.1,
          totalFee: 0.25,
          tradingVolume: 0.15,
          netAssetValue: 0.2,
          trackingError: 0.1,
          divergenceRate: 0.1,
          volatility: 0.1,
        },
        debug: {
          allowedRiskGrades: [2, 3, 4],
          totalEtfsBeforeFilter: 100,
          totalEtfsAfterFilter: 50,
        },
      };

      mockEtfRecommendService.getRecommendations.mockResolvedValue(mockResult);

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(200);
      expect(json.message).toBe('ETF 추천 성공');
      expect(json.data).toEqual(mockResult);
      expect(mockEtfRecommendService.getRecommendations).toHaveBeenCalledWith(
        BigInt('61'),
        10
      );
    });
  });

  describe('에러 처리 테스트', () => {
    beforeEach(() => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '61' },
      });
    });

    it('데이터베이스 오류 시 500 에러를 반환한다', async () => {
      // Given
      const dbError = new Error('Database connection failed');
      mockEtfRecommendService.getRecommendations.mockRejectedValue(dbError);

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(500);
      expect(json.message).toBe(
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    });

    it('서비스 오류 시 500 에러를 반환한다', async () => {
      // Given
      const serviceError = new Error('Service error occurred');
      mockEtfRecommendService.getRecommendations.mockRejectedValue(
        serviceError
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(500);
      expect(json.message).toBe(
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    });

    it('알 수 없는 오류 시 500 에러를 반환한다', async () => {
      // Given
      const unknownError = new Error('Unknown error');
      mockEtfRecommendService.getRecommendations.mockRejectedValue(
        unknownError
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(500);
      expect(json.message).toBe('서버 오류가 발생했습니다.');
    });
  });
});
