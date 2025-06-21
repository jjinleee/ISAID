import { InvestType } from '@prisma/client';

// 세션 생성
export const createMockSession = (userId = '5') => ({
  user: {
    id: userId,
    email: 'test@test.com',
    name: '테스트 사용자',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
});

// 투자 성향 조회 mock 응답
export const mockInvestmentProfileResult = {
  investType: InvestType.CONSERVATIVE,
};

// 사용자 선호 ETF 카테고리 조회 mock 응답
export const mockUserEtfCategoriesResult = {
  userEtfCategories: [
    { etfCategory: { id: 6, fullPath: '주식-업종섹터-금융' } },
    { etfCategory: { id: 11, fullPath: '주식-업종섹터-정보기술' } },
    { etfCategory: { id: 10, fullPath: '주식-업종섹터-헬스케어' } },
  ],
};

// 전체 ETF 카테고리 mock 리스트
export const createMockEtfCategories = () => [
  { id: 1, fullPath: '주식-시장대표' },
  { id: 2, fullPath: '주식-업종섹터' },
  { id: 3, fullPath: '주식-업종섹터-건설' },
  { id: 4, fullPath: '주식-업종섹터-중공업' },
  { id: 5, fullPath: '주식-업종섹터-산업재' },
  { id: 6, fullPath: '주식-업종섹터-금융' },
  { id: 7, fullPath: '주식-업종섹터-에너지화학' },
  { id: 8, fullPath: '주식-업종섹터-경기소비재' },
  { id: 9, fullPath: '주식-업종섹터-생활소비재' },
  { id: 10, fullPath: '주식-업종섹터-헬스케어' },
  { id: 11, fullPath: '주식-업종섹터-정보기술' },
  { id: 12, fullPath: '주식-업종섹터-철강소재' },
  { id: 13, fullPath: '주식-업종섹터-업종테마' },
  { id: 14, fullPath: '주식-업종섹터-커뮤니케이션서비스' },
  { id: 15, fullPath: '주식-전략-가치' },
  { id: 16, fullPath: '주식-전략-성장' },
  { id: 17, fullPath: '주식-전략-배당' },
  { id: 18, fullPath: '주식-전략-변동성' },
  { id: 19, fullPath: '주식-전략-구조화' },
  { id: 20, fullPath: '주식-전략-기업그룹' },
  { id: 21, fullPath: '주식-전략-전략테마' },
  { id: 22, fullPath: '주식-전략-혼합/퀀트' },
  { id: 23, fullPath: '주식-규모-대형주' },
  { id: 24, fullPath: '주식-규모-중형주' },
  { id: 25, fullPath: '혼합자산' },
  { id: 26, fullPath: '혼합자산-주식+채권' },
];

// MBTI 제출 요청 - 유효한 데이터
export const createValidMbtiRequest = () => ({
  investType: InvestType.MODERATE,
  preferredCategories: [
    '주식-업종섹터-금융',
    '주식-업종섹터-정보기술',
    '주식-업종섹터-헬스케어',
  ],
});

// MBTI 제출 요청 - 유효하지 않은 데이터
export const createInvalidMbtiRequest = () => ({
  investType: 'INVALID_TYPE',
  preferredCategories: [],
});

// Prisma Mock 객체 생성
export const createMbtiServiceMock = () => ({
  investmentProfile: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
  },
  etfCategory: {
    findMany: jest.fn(),
  },
  userEtfCategory: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
});
