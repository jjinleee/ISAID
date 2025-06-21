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
