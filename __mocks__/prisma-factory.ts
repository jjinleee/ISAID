type MockFn<T> = {
  [P in keyof T]: jest.Mock;
};

export const createPrismaMock = (overrides = {}) => {
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
      upsert: jest.fn(),
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

// 투자성향 조회용 Mock
export const createInvestProfileMock = () => {
  return createPrismaMock({
    investmentProfile: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  });
};

// 선호 카테고리 조회용 Mock
export const createPreferredCategoryMock = () => {
  return createPrismaMock({
    etfCategory: {
      findMany: jest.fn(),
    },
    userEtfCategory: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  });
};
