/**
 * @jest-environment node
 */
import {
  calculateSharpeRatio,
  classifyRiskGrade,
  EtfRecommendService,
  generateReasons,
  getAllowedRiskGrades,
  getRiskBasedWeights,
  InvestmentProfileNotFoundError,
  NoEtfDataError,
  normalize,
  normalizeVolatilityByRiskGrade,
  NoTradingDataError,
} from '@/services/etf/etf-recommend-service';
import { EtfTestService } from '@/services/etf/etf-test-service';
import { InvestType } from '@prisma/client';
import {
  createAggressiveEtfData,
  createConservativeEtfData,
  createMockEtfData,
  createMockEtfList,
  createMockEtfRecommendationResponse,
  createMockMetricsData,
  createMockProcessedEtfData,
  createMockProcessedEtfList,
  createMockWeightsData,
  ERROR_MESSAGES,
  getTestRiskGradesByInvestType,
  TEST_USER_ID,
} from '../helpers/etf-recommend-helpers';

// Mock EtfTestService
const mockEtfTestService = {
  getUserInvestType: jest.fn(),
} as unknown as jest.Mocked<EtfTestService>;

// Mock Prisma Client
const mockPrismaClient = {
  etf: {
    findMany: jest.fn(),
  },
} as any;

describe('EtfRecommendService', () => {
  let etfRecommendService: EtfRecommendService;

  beforeEach(() => {
    jest.clearAllMocks();
    etfRecommendService = new EtfRecommendService({
      etfTestService: mockEtfTestService,
      prismaClient: mockPrismaClient,
    });
  });

  describe('getRecommendations', () => {
    it('정상적으로 ETF 추천을 반환한다', async () => {
      // Given
      // MODERATE 투자자는 위험등급 3,4,5 허용
      // 변동성 0.03 (월간) → 연간 약 10.4% → 4등급 (저위험)
      // 변동성 0.04 (월간) → 연간 약 13.8% → 3등급 (중위험)
      // 변동성 0.02 (월간) → 연간 약 6.9% → 5등급 (초저위험)
      const mockEtfs = [
        createMockEtfData({
          id: BigInt(1),
          issueCode: 'TEST001',
          issueName: '저위험 ETF',
          volatility: '0.03', // 4등급
          return1y: '0.06',
        }),
        createMockEtfData({
          id: BigInt(2),
          issueCode: 'TEST002',
          issueName: '중위험 ETF',
          volatility: '0.04', // 3등급
          return1y: '0.08',
        }),
        createMockEtfData({
          id: BigInt(3),
          issueCode: 'TEST003',
          issueName: '초저위험 ETF',
          volatility: '0.02', // 5등급
          return1y: '0.04',
        }),
      ];

      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.MODERATE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue(mockEtfs);

      // When
      const result = await etfRecommendService.getRecommendations(
        TEST_USER_ID,
        2
      );

      // Then
      expect(result.recommendations).toHaveLength(2);
      expect(result.userProfile.investType).toBe(InvestType.MODERATE);
      expect(result.userProfile.totalEtfsAnalyzed).toBe(3);
      expect(result.userProfile.filteredEtfsCount).toBe(3);
      expect(result.debug.allowedRiskGrades).toEqual([3, 4, 5]);
      expect(mockEtfTestService.getUserInvestType).toHaveBeenCalledWith(
        TEST_USER_ID
      );
    });

    it('투자 성향이 없으면 InvestmentProfileNotFoundError를 던진다', async () => {
      // Given
      mockEtfTestService.getUserInvestType.mockResolvedValue(null);

      // When & Then
      await expect(
        etfRecommendService.getRecommendations(TEST_USER_ID)
      ).rejects.toThrow(InvestmentProfileNotFoundError);
      await expect(
        etfRecommendService.getRecommendations(TEST_USER_ID)
      ).rejects.toThrow(ERROR_MESSAGES.INVESTMENT_PROFILE_NOT_FOUND);
    });

    it('ETF 데이터가 없으면 NoEtfDataError를 던진다', async () => {
      // Given
      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.MODERATE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue([]);

      // When & Then
      await expect(
        etfRecommendService.getRecommendations(TEST_USER_ID)
      ).rejects.toThrow(NoEtfDataError);
      await expect(
        etfRecommendService.getRecommendations(TEST_USER_ID)
      ).rejects.toThrow(ERROR_MESSAGES.NO_ETF_DATA);
    });

    it('거래 데이터가 있는 ETF가 없으면 NoTradingDataError를 던진다', async () => {
      // Given
      const etfWithoutTradingData = createMockEtfData({ tradings: [] });
      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.MODERATE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue([etfWithoutTradingData]);

      // When & Then
      await expect(
        etfRecommendService.getRecommendations(TEST_USER_ID)
      ).rejects.toThrow(NoTradingDataError);
      await expect(
        etfRecommendService.getRecommendations(TEST_USER_ID)
      ).rejects.toThrow(ERROR_MESSAGES.NO_TRADING_DATA);
    });

    it('투자 성향에 맞지 않는 위험등급 ETF는 필터링된다', async () => {
      // Given
      const conservativeEtf = createConservativeEtfData(); // 위험등급 4-5
      const aggressiveEtf = createAggressiveEtfData(); // 위험등급 1-2
      mockEtfTestService.getUserInvestType.mockResolvedValue(
        InvestType.CONSERVATIVE
      );
      mockPrismaClient.etf.findMany.mockResolvedValue([
        conservativeEtf,
        aggressiveEtf,
      ]);

      // When
      const result = await etfRecommendService.getRecommendations(TEST_USER_ID);

      // Then
      expect(result.recommendations.length).toBeLessThanOrEqual(2);
      // 보수적 투자자는 저위험 ETF만 추천받아야 함
      result.recommendations.forEach((rec) => {
        expect(rec.riskGrade).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe('getEtfData', () => {
    it('정상적으로 ETF 데이터를 조회한다', async () => {
      // Given
      const mockEtfs = createMockEtfList(2);
      mockPrismaClient.etf.findMany.mockResolvedValue(mockEtfs);

      // When
      const result = await etfRecommendService.getEtfData();

      // Then
      expect(result).toHaveLength(2);
      expect(mockPrismaClient.etf.findMany).toHaveBeenCalledWith({
        where: {
          AND: [
            { return1y: { not: null } },
            { etfTotalFee: { not: null } },
            { netAssetTotalAmount: { not: null } },
            { traceErrRate: { not: null } },
            { divergenceRate: { not: null } },
            { volatility: { not: null } },
            { volatility: { not: '' } },
          ],
        },
        include: {
          category: { select: { fullPath: true } },
          tradings: {
            where: {
              baseDate: { gte: expect.any(Date) },
              accTotalValue: { gt: 0 },
            },
            select: {
              accTotalValue: true,
              flucRate: true,
            },
            orderBy: { baseDate: 'desc' },
            take: 30,
          },
        },
        orderBy: { netAssetTotalAmount: 'desc' },
        take: 400,
      });
    });
  });

  describe('processEtfData', () => {
    it('ETF 데이터를 올바르게 처리한다', () => {
      // Given
      const mockEtfs = createMockEtfList(2);

      // When
      const result = etfRecommendService.processEtfData(mockEtfs);

      // Then
      expect(result).toHaveLength(2);
      result.forEach((processedEtf, index) => {
        expect(processedEtf.id).toBe(BigInt(index + 1));
        expect(processedEtf.processedData.return1y).toBe(0.05 + index * 0.02);
        expect(processedEtf.processedData.volatility).toBe(0.1 + index * 0.02);
        expect(processedEtf.processedData.riskGrade).toBeDefined();
        expect(processedEtf.processedData.avgTradingVolume).toBeGreaterThan(0);
        expect(processedEtf.processedData.flucRate).toBeDefined();
      });
    });

    it('거래 데이터가 없는 ETF도 처리한다', () => {
      // Given
      const etfWithoutTrading = createMockEtfData({ tradings: [] });

      // When
      const result = etfRecommendService.processEtfData([etfWithoutTrading]);

      // Then
      expect(result[0].processedData.avgTradingVolume).toBe(0);
      expect(result[0].processedData.flucRate).toBe(0);
    });
  });

  describe('calculateMetrics', () => {
    it('정규화를 위한 메트릭스를 올바르게 계산한다', () => {
      // Given
      const processedEtfs = createMockProcessedEtfList(3);

      // When
      const result = etfRecommendService.calculateMetrics(processedEtfs);

      // Then
      expect(result.return1y.min).toBeLessThan(result.return1y.max);
      expect(result.etfTotalFee.min).toBeLessThan(result.etfTotalFee.max);
      expect(result.netAssetTotalAmount.min).toBeLessThan(
        result.netAssetTotalAmount.max
      );
      expect(result.traceErrRate.min).toBeLessThan(result.traceErrRate.max);
      expect(result.divergenceRate.min).toBeLessThan(result.divergenceRate.max);
      expect(result.volatility.min).toBeLessThan(result.volatility.max);
      expect(result.tradingVolume.min).toBeLessThan(result.tradingVolume.max);
    });

    it('빈 배열에 대해서도 안전하게 처리한다', () => {
      // Given
      const emptyArray: any[] = [];

      // When
      const result = etfRecommendService.calculateMetrics(emptyArray);

      // Then
      expect(result.tradingVolume.min).toBe(0);
      expect(result.tradingVolume.max).toBe(0);
    });
  });

  describe('calculateEtfScores', () => {
    it('ETF 점수를 올바르게 계산한다', () => {
      // Given
      const processedEtfs = createMockProcessedEtfList(3);
      const metrics = createMockMetricsData();
      const weights = createMockWeightsData();
      const allowedRiskGrades = [3, 4, 5];
      const investType = InvestType.MODERATE;

      // When
      const result = etfRecommendService.calculateEtfScores(
        processedEtfs,
        metrics,
        weights,
        allowedRiskGrades,
        investType
      );

      // Then
      expect(result).toHaveLength(3);
      result.forEach((etf) => {
        expect(etf.score).toBeGreaterThanOrEqual(0);
        expect(etf.score).toBeLessThanOrEqual(1);
        expect(etf.metrics.sharpeRatio).toBeDefined();
        expect(etf.metrics.totalFee).toBeDefined();
        expect(etf.metrics.tradingVolume).toBeDefined();
        expect(etf.metrics.netAssetValue).toBeDefined();
        expect(etf.metrics.trackingError).toBeDefined();
        expect(etf.metrics.divergenceRate).toBeDefined();
        expect(etf.metrics.volatility).toBeDefined();
        expect(etf.metrics.normalizedVolatility).toBeDefined();
        expect(etf.reasons).toBeInstanceOf(Array);
      });
    });

    it('허용되지 않는 위험등급 ETF는 필터링한다', () => {
      // Given
      const processedEtfs = createMockProcessedEtfList(3);
      const metrics = createMockMetricsData();
      const weights = createMockWeightsData();
      const allowedRiskGrades = [4, 5]; // 보수적 투자자
      const investType = InvestType.CONSERVATIVE;

      // When
      const result = etfRecommendService.calculateEtfScores(
        processedEtfs,
        metrics,
        weights,
        allowedRiskGrades,
        investType
      );

      // Then
      // 일부 ETF는 위험등급이 맞지 않아 필터링될 수 있음
      result.forEach((etf) => {
        expect(allowedRiskGrades).toContain(etf.riskGrade);
      });
    });
  });
});

describe('Utility Functions', () => {
  describe('classifyRiskGrade', () => {
    it('변동성에 따라 올바른 위험등급을 반환한다', () => {
      expect(classifyRiskGrade(0.01)).toBe(5); // 초저위험
      expect(classifyRiskGrade(0.025)).toBe(4); // 저위험
      expect(classifyRiskGrade(0.043)).toBe(3); // 중위험
      expect(classifyRiskGrade(0.057)).toBe(2); // 고위험
      expect(classifyRiskGrade(0.06)).toBe(1); // 초고위험
    });
  });

  describe('calculateSharpeRatio', () => {
    it('올바른 샤프비율을 계산한다', () => {
      const result = calculateSharpeRatio(0.1, 0.15, 3);
      expect(result).toBeCloseTo((0.1 - 0.03) / 0.15, 2);
    });

    it('변동성이 0이면 0을 반환한다', () => {
      expect(calculateSharpeRatio(0.1, 0, 3)).toBe(0);
    });
  });

  describe('getRiskBasedWeights', () => {
    it('투자 성향에 따라 올바른 가중치를 반환한다', () => {
      const conservative = getRiskBasedWeights(InvestType.CONSERVATIVE);
      const aggressive = getRiskBasedWeights(InvestType.AGGRESSIVE);

      expect(conservative.totalFee).toBeGreaterThan(aggressive.totalFee);
      expect(conservative.sharpeRatio).toBeLessThan(aggressive.sharpeRatio);
      expect(conservative.tradingVolume).toBeLessThan(aggressive.tradingVolume);
    });

    it('알 수 없는 투자 성향에 대해 NEUTRAL 가중치를 반환한다', () => {
      const result = getRiskBasedWeights('UNKNOWN' as InvestType);
      const neutral = getRiskBasedWeights(InvestType.NEUTRAL);
      expect(result).toEqual(neutral);
    });
  });

  describe('getAllowedRiskGrades', () => {
    it('투자 성향에 따라 올바른 허용 위험등급을 반환한다', () => {
      expect(getAllowedRiskGrades(InvestType.CONSERVATIVE)).toEqual([4, 5]);
      expect(getAllowedRiskGrades(InvestType.MODERATE)).toEqual([3, 4, 5]);
      expect(getAllowedRiskGrades(InvestType.NEUTRAL)).toEqual([2, 3, 4, 5]);
      expect(getAllowedRiskGrades(InvestType.ACTIVE)).toEqual([1, 2, 3, 4, 5]);
      expect(getAllowedRiskGrades(InvestType.AGGRESSIVE)).toEqual([
        1, 2, 3, 4, 5,
      ]);
    });
  });

  describe('normalize', () => {
    it('값을 0-1 범위로 정규화한다', () => {
      expect(normalize(5, 0, 10)).toBe(0.5);
      expect(normalize(0, 0, 10)).toBe(0);
      expect(normalize(10, 0, 10)).toBe(1);
    });

    it('최대값과 최소값이 같으면 0.5를 반환한다', () => {
      expect(normalize(5, 5, 5)).toBe(0.5);
    });
  });

  describe('normalizeVolatilityByRiskGrade', () => {
    it('위험등급에 따라 올바른 정규화된 값을 반환한다', () => {
      expect(normalizeVolatilityByRiskGrade(1)).toBe(1.0); // 초고위험 = 0.0
      expect(normalizeVolatilityByRiskGrade(3)).toBe(0.6); // 중위험 = 0.6
      expect(normalizeVolatilityByRiskGrade(5)).toBe(0.2); // 초저위험 = 1.0
    });
  });

  describe('generateReasons', () => {
    it('ETF 특성에 따라 추천 이유를 생성한다', () => {
      const etf = createMockEtfData();
      const metrics = {
        sharpeRatio: 1.2,
        totalFee: 0.2,
        tradingVolume: 1500000000,
        netAssetValue: 150000000000,
        trackingError: 0.3,
        divergenceRate: 0.2,
        volatility: 0.12,
      };
      const investType = InvestType.MODERATE;
      const riskGrade = 3;

      const reasons = generateReasons(etf, metrics, investType, riskGrade);

      expect(reasons).toBeInstanceOf(Array);
      expect(reasons.length).toBeGreaterThan(0);
      reasons.forEach((reason) => {
        expect(reason.title).toBeDefined();
        expect(reason.description).toBeDefined();
      });
    });
  });
});
