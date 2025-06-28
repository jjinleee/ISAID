import {
  createChallengePrismaMock,
  createEtfTestPrismaMock,
  createPrismaMock,
} from './prisma-factory';

// Jest에서 사용할 수 있도록 전역 mock 인스턴스 생성
let mockPrismaInstance = createPrismaMock();

export const prisma = mockPrismaInstance;

// 테스트에서 mock을 재설정할 수 있는 헬퍼 함수
export const resetPrismaMock = () => {
  mockPrismaInstance = createPrismaMock();
  return mockPrismaInstance;
};

// 특화된 mock으로 재설정하는 함수들
export const resetWithEtfTestPrismaMock = () => {
  mockPrismaInstance = createEtfTestPrismaMock();
  return mockPrismaInstance;
};

export const resetWithChallengePrismaMock = () => {
  mockPrismaInstance = createChallengePrismaMock();
  return mockPrismaInstance;
};

// 커스텀 overrides로 재설정
export const resetWithCustomMock = (overrides = {}) => {
  mockPrismaInstance = createPrismaMock(overrides);
  return mockPrismaInstance;
};

export const getPrismaMock = () => mockPrismaInstance;
