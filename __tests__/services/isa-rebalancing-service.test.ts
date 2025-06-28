/**
 * @jest-environment node
 */
import {
  InvestmentProfileNotFoundError,
  InvestType,
  ISAAccountNotFoundError,
  RebalancingService,
  UserHoldingDetails,
  UserPortfolio,
} from '@/services/isa/rebalancing-service';
import { InvestType as PrismaInvestType } from '@prisma/client';
import {
  createMockEtfHoldingSnapshot,
  createMockGeneralHolding,
  createMockInvestmentProfile,
  createMockISAAccount,
  ERROR_MESSAGES,
  TEST_USER_ID,
} from '../helpers/rebalancing-helpers';

// Mock Prisma Client
const mockPrismaClient = {
  investmentProfile: {
    findUnique: jest.fn(),
  },
  iSAAccount: {
    findUnique: jest.fn(),
  },
} as any;

describe('RebalancingService', () => {
  let rebalancingService: RebalancingService;

  beforeEach(() => {
    jest.clearAllMocks();
    rebalancingService = new RebalancingService(mockPrismaClient);
  });

  describe('getRebalancingRecommendation', () => {
    it('투자 성향 정보가 없으면 InvestmentProfileNotFoundError를 던진다', async () => {
      // Given
      mockPrismaClient.investmentProfile.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(
        rebalancingService.getRebalancingRecommendation(TEST_USER_ID)
      ).rejects.toThrow(InvestmentProfileNotFoundError);
      await expect(
        rebalancingService.getRebalancingRecommendation(TEST_USER_ID)
      ).rejects.toThrow(ERROR_MESSAGES.INVESTMENT_PROFILE_NOT_FOUND);
    });

    it('ISA 계좌 정보가 없으면 ISAAccountNotFoundError를 던진다', async () => {
      // Given
      mockPrismaClient.investmentProfile.findUnique.mockResolvedValue(
        createMockInvestmentProfile(PrismaInvestType.MODERATE)
      );
      mockPrismaClient.iSAAccount.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(
        rebalancingService.getRebalancingRecommendation(TEST_USER_ID)
      ).rejects.toThrow(ISAAccountNotFoundError);
      await expect(
        rebalancingService.getRebalancingRecommendation(TEST_USER_ID)
      ).rejects.toThrow(ERROR_MESSAGES.ISA_ACCOUNT_NOT_FOUND);
    });

    it('자산이 없으면 빈 포트폴리오와 0점을 반환한다', async () => {
      // Given
      mockPrismaClient.investmentProfile.findUnique.mockResolvedValue(
        createMockInvestmentProfile(PrismaInvestType.MODERATE)
      );
      mockPrismaClient.iSAAccount.findUnique.mockResolvedValue(
        createMockISAAccount()
      );

      // When
      const result =
        await rebalancingService.getRebalancingRecommendation(TEST_USER_ID);

      // Then
      expect(result.score).toBe(0);
      expect(result.rebalancingOpinions).toHaveLength(0);
      expect(result.recommendedPortfolio).toEqual([
        { category: '국내 주식', percentage: 25 },
        { category: '해외 주식', percentage: 25 },
        { category: '채권', percentage: 40 },
        { category: 'ELS', percentage: 5 },
        { category: '펀드', percentage: 5 },
      ]);
    });

    it('ETF 스냅샷 데이터가 있으면 스냅샷 데이터를 사용한다', async () => {
      // Given
      mockPrismaClient.investmentProfile.findUnique.mockResolvedValue(
        createMockInvestmentProfile(PrismaInvestType.MODERATE)
      );
      mockPrismaClient.iSAAccount.findUnique.mockResolvedValue({
        ...createMockISAAccount(),
        etfHoldingSnapshots: [
          createMockEtfHoldingSnapshot(BigInt(1), 1000000, '국내', '국내 ETF'),
          createMockEtfHoldingSnapshot(BigInt(2), 2000000, '해외', '해외 ETF'),
        ],
      });

      // When
      const result =
        await rebalancingService.getRebalancingRecommendation(TEST_USER_ID);

      // Then
      expect(result.score).toBeGreaterThan(0);
      expect(result.rebalancingOpinions).toHaveLength(5);

      // 국내 주식과 해외 주식 비중이 각각 33.3% 정도여야 함 (300만원 중 100만원, 200만원)
      const domesticStock = result.rebalancingOpinions.find(
        (op) => op.category === '국내 주식'
      );
      const foreignStock = result.rebalancingOpinions.find(
        (op) => op.category === '해외 주식'
      );

      expect(domesticStock?.userPercentage).toBeCloseTo(33.3, 1);
      expect(foreignStock?.userPercentage).toBeCloseTo(66.7, 1);
    });

    it('일반 자산(채권, 펀드, ELS)을 올바르게 처리한다', async () => {
      // Given
      mockPrismaClient.investmentProfile.findUnique.mockResolvedValue(
        createMockInvestmentProfile(PrismaInvestType.CONSERVATIVE)
      );
      mockPrismaClient.iSAAccount.findUnique.mockResolvedValue({
        ...createMockISAAccount(),
        generalHoldings: [
          createMockGeneralHolding('BOND', 5000000, '국채'),
          createMockGeneralHolding('FUND', 2000000, '펀드'),
          createMockGeneralHolding('ELS', 1000000, 'ELS 상품'),
        ],
      });

      // When
      const result =
        await rebalancingService.getRebalancingRecommendation(TEST_USER_ID);

      // Then
      expect(result.score).toBeGreaterThan(0);

      // 보수적 포트폴리오: 채권 60%, 펀드 15%, ELS 5%
      const bond = result.rebalancingOpinions.find(
        (op) => op.category === '채권'
      );
      const fund = result.rebalancingOpinions.find(
        (op) => op.category === '펀드'
      );
      const els = result.rebalancingOpinions.find(
        (op) => op.category === 'ELS'
      );

      expect(bond?.userPercentage).toBeCloseTo(62.5, 1); // 500만원 / 800만원
      expect(fund?.userPercentage).toBeCloseTo(25, 1); // 200만원 / 800만원
      expect(els?.userPercentage).toBeCloseTo(12.5, 1); // 100만원 / 800만원
    });

    it('투자 성향에 따라 다른 권장 포트폴리오를 반환한다', async () => {
      // Given
      mockPrismaClient.investmentProfile.findUnique.mockResolvedValue(
        createMockInvestmentProfile(PrismaInvestType.AGGRESSIVE)
      );
      mockPrismaClient.iSAAccount.findUnique.mockResolvedValue(
        createMockISAAccount()
      );

      // When
      const result =
        await rebalancingService.getRebalancingRecommendation(TEST_USER_ID);

      // Then
      expect(result.recommendedPortfolio).toEqual([
        { category: '국내 주식', percentage: 40 },
        { category: '해외 주식', percentage: 40 },
        { category: '채권', percentage: 10 },
        { category: 'ELS', percentage: 5 },
        { category: '펀드', percentage: 5 },
      ]);
    });
  });

  describe('calculateScore', () => {
    it('완벽한 매칭일 때 100점을 반환한다', () => {
      // Given
      const userPortfolio: UserPortfolio[] = [
        {
          category: '국내 주식',
          percentage: 25,
          totalValue: 2500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
        {
          category: '해외 주식',
          percentage: 25,
          totalValue: 2500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
        {
          category: '채권',
          percentage: 40,
          totalValue: 4000000,
          profitOrLoss: 0,
          returnRate: 0,
        },
        {
          category: 'ELS',
          percentage: 5,
          totalValue: 500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
        {
          category: '펀드',
          percentage: 5,
          totalValue: 500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
      ];
      const recommendedPortfolio = [
        { category: '국내 주식', percentage: 25 },
        { category: '해외 주식', percentage: 25 },
        { category: '채권', percentage: 40 },
        { category: 'ELS', percentage: 5 },
        { category: '펀드', percentage: 5 },
      ];

      // When
      const score = (rebalancingService as any).calculateScore(
        userPortfolio,
        recommendedPortfolio
      );

      // Then
      expect(score).toBe(100);
    });

    it('차이가 클수록 낮은 점수를 반환한다', () => {
      // Given
      const userPortfolio: UserPortfolio[] = [
        {
          category: '국내 주식',
          percentage: 50,
          totalValue: 5000000,
          profitOrLoss: 0,
          returnRate: 0,
        },
        {
          category: '해외 주식',
          percentage: 50,
          totalValue: 5000000,
          profitOrLoss: 0,
          returnRate: 0,
        },
      ];
      const recommendedPortfolio = [
        { category: '국내 주식', percentage: 25 },
        { category: '해외 주식', percentage: 25 },
      ];

      // When
      const score = (rebalancingService as any).calculateScore(
        userPortfolio,
        recommendedPortfolio
      );

      // Then
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('generateRebalancingOpinions', () => {
    it('적정 비중일 때 적절한 의견을 생성한다', () => {
      // Given
      const userPortfolio: UserPortfolio[] = [
        {
          category: '국내 주식',
          percentage: 25,
          totalValue: 2500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
      ];
      const recommendedPortfolio = [{ category: '국내 주식', percentage: 25 }];
      const userHoldings: UserHoldingDetails[] = [];

      // When
      const opinions = (rebalancingService as any).generateRebalancingOpinions(
        userPortfolio,
        recommendedPortfolio,
        userHoldings
      );

      // Then
      expect(opinions).toHaveLength(1);
      expect(opinions[0].opinion).toBe('적정 비중');
      expect(opinions[0].userPercentage).toBe(25);
      expect(opinions[0].recommendedPercentage).toBe(25);
    });

    it('비중이 높을 때 축소 의견을 생성한다', () => {
      // Given
      const userPortfolio: UserPortfolio[] = [
        {
          category: '국내 주식',
          percentage: 35,
          totalValue: 3500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
      ];
      const recommendedPortfolio = [{ category: '국내 주식', percentage: 25 }];
      const userHoldings: UserHoldingDetails[] = [];

      // When
      const opinions = (rebalancingService as any).generateRebalancingOpinions(
        userPortfolio,
        recommendedPortfolio,
        userHoldings
      );

      // Then
      expect(opinions).toHaveLength(1);
      expect(opinions[0].opinion).toBe('비중 축소 필요');
      expect(opinions[0].userPercentage).toBe(35);
      expect(opinions[0].recommendedPercentage).toBe(25);
    });

    it('비중이 낮을 때 확대 의견을 생성한다', () => {
      // Given
      const userPortfolio: UserPortfolio[] = [
        {
          category: '국내 주식',
          percentage: 15,
          totalValue: 1500000,
          profitOrLoss: 0,
          returnRate: 0,
        },
      ];
      const recommendedPortfolio = [{ category: '국내 주식', percentage: 25 }];
      const userHoldings: UserHoldingDetails[] = [];

      // When
      const opinions = (rebalancingService as any).generateRebalancingOpinions(
        userPortfolio,
        recommendedPortfolio,
        userHoldings
      );

      // Then
      expect(opinions).toHaveLength(1);
      expect(opinions[0].opinion).toBe('비중 확대 필요');
      expect(opinions[0].userPercentage).toBe(15);
      expect(opinions[0].recommendedPercentage).toBe(25);
    });
  });
});
