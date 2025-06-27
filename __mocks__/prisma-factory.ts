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

// ETF 테스트용 확장 Prisma Mock 타입 정의
export type EtfTestPrismaMock = {
  user: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  investmentProfile: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  etfCategory: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
  };
  userEtfCategory: {
    findMany: jest.Mock;
    createMany: jest.Mock;
    deleteMany: jest.Mock;
  };
  etf: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
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
