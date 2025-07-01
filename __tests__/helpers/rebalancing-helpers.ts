import {
  InvestType,
  UserHoldingDetails,
  UserPortfolio,
} from '@/services/isa/rebalancing-service';
import { InvestType as PrismaInvestType } from '@prisma/client';

export const TEST_USER_ID = BigInt('123');

export const ERROR_MESSAGES = {
  INVESTMENT_PROFILE_NOT_FOUND: '투자 성향 정보가 없습니다.',
  ISA_ACCOUNT_NOT_FOUND: 'ISA 계좌 정보가 없습니다.',
};

export function createMockInvestmentProfile(
  investType: PrismaInvestType = PrismaInvestType.MODERATE
) {
  return {
    userId: TEST_USER_ID,
    investType,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createMockISAAccount() {
  return {
    id: BigInt(1),
    userId: TEST_USER_ID,
    accountNumber: '1234567890',
    generalHoldingSnapshots: [],
    generalHoldings: [],
    etfHoldingSnapshots: [],
    etfHoldings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createMockGeneralHolding(
  instrumentType: 'BOND' | 'FUND' | 'ELS',
  totalCost: number,
  productName?: string
) {
  return {
    totalCost,
    product: {
      instrumentType,
      productName: productName || `${instrumentType} 상품`,
    },
  };
}

export function createMockEtfHoldingSnapshot(
  etfId: bigint,
  evaluatedAmount: number,
  idxMarketType: '국내' | '해외' | '국내&해외',
  issueNameKo?: string
) {
  return {
    evaluatedAmount,
    etf: {
      id: etfId,
      issueNameKo: issueNameKo || `${idxMarketType} ETF`,
      idxMarketType,
    },
  };
}

export function createMockEtfHolding(
  etfId: bigint,
  quantity: number,
  avgCost: number,
  idxMarketType: '국내' | '해외' | '국내&해외',
  issueNameKo?: string,
  currentPrice?: number
) {
  return {
    etfId,
    quantity: {
      toNumber: () => quantity,
      mul: (price: any) => ({ toNumber: () => quantity * price.toNumber() }),
    },
    avgCost: {
      toNumber: () => avgCost,
      mul: (qty: any) => ({ toNumber: () => avgCost * qty.toNumber() }),
    },
    etf: {
      id: etfId,
      issueNameKo: issueNameKo || `${idxMarketType} ETF`,
      idxMarketType,
      tradings: currentPrice
        ? [
            {
              tddClosePrice: { toNumber: () => currentPrice },
            },
          ]
        : [],
    },
  };
}

export function createMockUserHolding(
  etfId?: bigint,
  name = '테스트 자산',
  totalCost = 1000000,
  currentValue = 1100000,
  categoryPath = '국내 주식',
  assetType: 'ETF' | 'BOND' | 'FUND' | 'ELS' | 'CASH' = 'ETF'
): UserHoldingDetails {
  const profitOrLoss = currentValue - totalCost;
  const returnRate = totalCost > 0 ? (profitOrLoss / totalCost) * 100 : 0;

  return {
    etfId,
    name,
    totalCost,
    currentValue,
    profitOrLoss,
    returnRate,
    categoryPath,
    assetType,
  };
}

export function createMockUserPortfolio(
  category: string,
  percentage: number,
  totalValue: number,
  profitOrLoss = 0,
  returnRate = 0
): UserPortfolio {
  return {
    category,
    percentage,
    totalValue,
    profitOrLoss,
    returnRate,
  };
}

export function createMockRebalancingResponse(
  investType: InvestType = InvestType.MODERATE,
  score = 85.5
) {
  return {
    recommendedPortfolio: [
      { category: '국내 주식', percentage: 25 },
      { category: '해외 주식', percentage: 25 },
      { category: '채권', percentage: 40 },
      { category: 'ELS', percentage: 5 },
      { category: '펀드', percentage: 5 },
    ],
    score,
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
}

export function getTestRecommendedPortfolioByInvestType(
  investType: InvestType
) {
  const portfolios = {
    [InvestType.CONSERVATIVE]: [
      { category: '국내 주식', percentage: 10 },
      { category: '해외 주식', percentage: 10 },
      { category: '채권', percentage: 60 },
      { category: 'ELS', percentage: 5 },
      { category: '펀드', percentage: 15 },
    ],
    [InvestType.MODERATE]: [
      { category: '국내 주식', percentage: 25 },
      { category: '해외 주식', percentage: 25 },
      { category: '채권', percentage: 40 },
      { category: 'ELS', percentage: 5 },
      { category: '펀드', percentage: 5 },
    ],
    [InvestType.NEUTRAL]: [
      { category: '국내 주식', percentage: 30 },
      { category: '해외 주식', percentage: 30 },
      { category: '채권', percentage: 30 },
      { category: 'ELS', percentage: 5 },
      { category: '펀드', percentage: 5 },
    ],
    [InvestType.ACTIVE]: [
      { category: '국내 주식', percentage: 35 },
      { category: '해외 주식', percentage: 35 },
      { category: '채권', percentage: 20 },
      { category: 'ELS', percentage: 5 },
      { category: '펀드', percentage: 5 },
    ],
    [InvestType.AGGRESSIVE]: [
      { category: '국내 주식', percentage: 40 },
      { category: '해외 주식', percentage: 40 },
      { category: '채권', percentage: 10 },
      { category: 'ELS', percentage: 5 },
      { category: '펀드', percentage: 5 },
    ],
  };

  return portfolios[investType];
}
