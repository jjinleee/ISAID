type MockFn<T> = {
  [P in keyof T]: jest.Mock;
};

export const createPrismaMock = (overrides = {}) => {
  const baseMock = {
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  return {
    ...baseMock,
    ...overrides,
  };
};

export const createEtfTestPrismaMock = (overrides = {}) => {
  const baseMock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    investmentProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    etfCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    userEtfCategory: {
      findMany: jest.fn(),
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    etf: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  return {
    ...baseMock,
    ...overrides,
  };
};

export const createChallengePrismaMock = (overrides = {}) => {
  const baseMock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    challenge: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userChallengeClaim: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    userChallengeProgress: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      upsert: jest.fn(),
    },
    etf: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    etfDailyTrading: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    eTFTransaction: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    eTFHolding: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    isaAccount: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  return {
    ...baseMock,
    ...overrides,
  };
};

// 타입 정의
export type BasePrismaMock = ReturnType<typeof createPrismaMock>;
export type EtfTestPrismaMock = ReturnType<typeof createEtfTestPrismaMock>;
export type ChallengePrismaMock = ReturnType<typeof createChallengePrismaMock>;
export type PrismaMockInstance =
  | BasePrismaMock
  | EtfTestPrismaMock
  | ChallengePrismaMock;
