/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/etf/recommend/route';
import { EtfRecommendationService } from '@/services/etf/etf-recommendation-service';
import { EtfTestService } from '@/services/etf/etf-test-service';
import { InvestType } from '@prisma/client';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

// Mock 모듈들
jest.mock('next-auth');
jest.mock('@/services/etf/etf-recommendation-service');
jest.mock('@/services/etf/etf-test-service');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    etf: {
      findMany: jest.fn(),
    },
    etfDailyTrading: {
      findMany: jest.fn(),
    },
  },
}));
jest.mock('@/lib/auth-options', () => ({
  authOptions: {},
}));

describe('GET /api/etf/recommend', () => {
  let mockGetServerSession: jest.MockedFunction<typeof getServerSession>;
  let mockEtfRecommendationService: jest.Mocked<EtfRecommendationService>;
  let mockEtfTestService: jest.Mocked<EtfTestService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // getServerSession 모킹
    mockGetServerSession = getServerSession as jest.MockedFunction<
      typeof getServerSession
    >;
    mockGetServerSession.mockImplementation(async () => null);

    // EtfTestService 모킹
    mockEtfTestService = {
      getUserInvestType: jest.fn(),
      saveMbtiResult: jest.fn(),
      getUserPreferredCategories: jest.fn(),
      getUserInvestmentProfile: jest.fn(),
    } as unknown as jest.Mocked<EtfTestService>;

    // EtfRecommendationService 모킹
    mockEtfRecommendationService = {
      getRecommendations: jest.fn(),
    } as unknown as jest.Mocked<EtfRecommendationService>;

    // 생성자 모킹
    (
      EtfTestService as jest.MockedClass<typeof EtfTestService>
    ).mockImplementation(() => mockEtfTestService);
    (
      EtfRecommendationService as jest.MockedClass<
        typeof EtfRecommendationService
      >
    ).mockImplementation(() => mockEtfRecommendationService);
  });

  describe('인증 테스트', () => {
    it('인증되지 않은 사용자는 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

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
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' }, // id가 없음
      } as any);

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
      mockGetServerSession.mockResolvedValue({
        user: { id: '61' },
      } as any);
    });

    it('투자 성향이 없으면 400 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendationService.getRecommendations.mockRejectedValue(
        new Error('투자 성향 테스트를 먼저 완료해주세요.')
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(400);
      expect(json.message).toBe('투자 성향 테스트를 먼저 완료해주세요.');
      expect(
        mockEtfRecommendationService.getRecommendations
      ).toHaveBeenCalledWith(BigInt('61'), 10);
    });

    it('ETF 데이터가 없으면 404 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendationService.getRecommendations.mockRejectedValue(
        new Error('추천할 수 있는 ETF가 없습니다.')
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
      mockEtfRecommendationService.getRecommendations.mockRejectedValue(
        new Error('거래 데이터가 있는 ETF가 없습니다.')
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
            category: '주식/국내',
            score: 0.85,
            riskGrade: 3,
            flucRate: 0.02,
            metrics: {
              sharpeRatio: 1.2,
              totalFee: 0.25,
              tradingVolume: 500000000,
              netAssetValue: 2000000000,
              trackingError: 0.08,
              divergenceRate: 0.03,
              volatility: 0.12,
              normalizedVolatility: 0.6,
            },
            reasons: [
              {
                title: '우수한 샤프비율',
                description: '샤프비율이 1.0을 초과하여...',
              },
            ],
          },
        ],
        userProfile: {
          investType: InvestType.MODERATE,
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
          allowedRiskGrades: [3, 4, 5],
          totalEtfsBeforeFilter: 100,
          totalEtfsAfterFilter: 50,
        },
      };

      mockEtfRecommendationService.getRecommendations.mockResolvedValue(
        mockResult
      );

      // When
      const req = new NextRequest('http://localhost:3000/api/etf/recommend');
      const res = await GET(req);
      const json = await res.json();

      // Then
      expect(res.status).toBe(200);
      expect(json.message).toBe('ETF 추천 성공');
      expect(json.data).toEqual(mockResult);
      expect(
        mockEtfRecommendationService.getRecommendations
      ).toHaveBeenCalledWith(BigInt('61'), 10);
    });
  });

  describe('에러 처리 테스트', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '61' },
      } as any);
    });

    it('데이터베이스 오류 시 500 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendationService.getRecommendations.mockRejectedValue(
        new Error('Database connection failed')
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

    it('서비스 오류 시 500 에러를 반환한다', async () => {
      // Given
      mockEtfRecommendationService.getRecommendations.mockRejectedValue(
        new Error('Service error')
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
      mockEtfRecommendationService.getRecommendations.mockRejectedValue(
        new Error('Unknown error')
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

describe('EtfRecommendationService 단위 테스트', () => {
  let mockEtfTestService: jest.Mocked<EtfTestService>;
  let mockPrismaClient: any;
  let etfRecommendationService: EtfRecommendationService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEtfTestService = {
      getUserInvestType: jest.fn(),
      saveMbtiResult: jest.fn(),
      getUserPreferredCategories: jest.fn(),
      getUserInvestmentProfile: jest.fn(),
    } as unknown as jest.Mocked<EtfTestService>;

    mockPrismaClient = {
      etf: {
        findMany: jest.fn(),
      },
      etfDailyTrading: {
        findMany: jest.fn(),
      },
    };

    // 실제 서비스 인스턴스를 생성하되 의존성을 모킹
    etfRecommendationService = new EtfRecommendationService({
      etfTestService: mockEtfTestService,
      prismaClient: mockPrismaClient,
    });
  });

  describe('getRecommendations', () => {
    it('투자 성향이 없으면 에러를 던진다', async () => {
      // Given
      const userId = BigInt('61');
      mockEtfTestService.getUserInvestType.mockResolvedValue(null);

      // When & Then
      await expect(
        etfRecommendationService.getRecommendations(userId)
      ).rejects.toThrow('투자 성향 테스트를 먼저 완료해주세요.');

      expect(mockEtfTestService.getUserInvestType).toHaveBeenCalledWith(userId);
    });

    it('ETF 데이터가 없으면 에러를 던진다', async () => {
      // Given
      const userId = BigInt('61');
      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.MODERATE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue([]);

      // When & Then
      await expect(
        etfRecommendationService.getRecommendations(userId)
      ).rejects.toThrow('추천할 수 있는 ETF가 없습니다.');
    });

    it('거래 데이터가 있는 ETF가 없으면 에러를 던진다', async () => {
      // Given
      const userId = BigInt('61');
      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.MODERATE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue([
        {
          id: BigInt(1),
          issueCode: 'TEST001',
          issueName: '테스트 ETF',
          return1y: '0.08',
          etfTotalFee: '0.25',
          netAssetTotalAmount: '2000000000',
          traceErrRate: '0.08',
          divergenceRate: '0.03',
          volatility: '0.12',
          category: { fullPath: '주식/국내' },
          tradings: [], // 거래 데이터 없음
        },
      ]);

      // When & Then
      await expect(
        etfRecommendationService.getRecommendations(userId)
      ).rejects.toThrow('거래 데이터가 있는 ETF가 없습니다.');
    });

    it('성공적으로 추천 결과를 반환한다', async () => {
      // Given
      const userId = BigInt('61');
      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.MODERATE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue([
        {
          id: BigInt(1),
          issueCode: 'TEST001',
          issueName: '테스트 ETF',
          return1y: '0.08',
          etfTotalFee: '0.25',
          netAssetTotalAmount: '2000000000',
          traceErrRate: '0.08',
          divergenceRate: '0.03',
          volatility: '0.12',
          category: { fullPath: '주식/국내' },
          tradings: [
            {
              accTotalValue: '500000000',
              flucRate: '0.02',
            },
          ],
        },
      ]);

      // When
      const result = await etfRecommendationService.getRecommendations(
        userId,
        5
      );

      // Then
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.userProfile.investType).toBe(InvestType.MODERATE);
      expect(result.weights).toBeDefined();
      expect(result.debug).toBeDefined();
    });
  });
});
