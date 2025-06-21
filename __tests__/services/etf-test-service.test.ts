/**
 * @jest-environment node
 */
import { createPrismaMock } from '@/__mocks__/prisma-factory';
import { EtfTestService } from '@/services/etf/etf-test-service';
import { InvestType } from '@prisma/client';
import {
  createMockEtfCategories,
  createValidMbtiRequest,
  mockInvestmentProfileResult,
  mockUserEtfCategoriesResult,
} from '../helpers/etf-test-helpers';

let mockPrisma: ReturnType<typeof createPrismaMock>;

jest.mock('@/lib/prisma', () => ({
  get prisma() {
    return mockPrisma;
  },
}));

describe('EtfTestService', () => {
  let etfMbtiService: EtfTestService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = createPrismaMock();
    etfMbtiService = new EtfTestService();
  });

  describe('saveMbtiResult', () => {
    const validParams = {
      userId: BigInt(5),
      investType: InvestType.MODERATE,
      preferredCategories: [
        '주식-업종섹터-금융',
        '주식-업종섹터-정보기술',
        '주식-업종섹터-헬스케어',
      ],
    };

    it('정상적으로 MBTI 결과를 저장한다-(1)', async () => {
      const mockCategories = createMockEtfCategories();
      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const mockTx = {
          investmentProfile: { upsert: jest.fn() },
          etfCategory: {
            findMany: jest
              .fn()
              .mockResolvedValue(
                mockCategories.filter((c) =>
                  validParams.preferredCategories.includes(c.fullPath)
                )
              ),
          },
          userEtfCategory: {
            deleteMany: jest.fn(),
            createMany: jest.fn(),
          },
        };
        return await callback(mockTx as any);
      });

      mockPrisma.$transaction = mockTransaction;
      await etfMbtiService.saveMbtiResult(validParams);

      expect(mockTransaction).toHaveBeenCalledTimes(1);
    });

    it('정상적으로 MBTI 결과를 저장한다-(2)', async () => {
      const mockCategories = createMockEtfCategories();
      const filteredCategories = mockCategories.filter((c) =>
        validParams.preferredCategories.includes(c.fullPath)
      );

      const mockUpsert = jest.fn();
      const mockFindMany = jest.fn().mockResolvedValue(filteredCategories);
      const mockDeleteMany = jest.fn();
      const mockCreateMany = jest.fn();

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const mockTx = {
          investmentProfile: { upsert: mockUpsert },
          etfCategory: { findMany: mockFindMany },
          userEtfCategory: {
            deleteMany: mockDeleteMany,
            createMany: mockCreateMany,
          },
        };
        return await callback(mockTx as any);
      });

      mockPrisma.$transaction = mockTransaction;

      await etfMbtiService.saveMbtiResult(validParams);

      expect(mockUpsert).toHaveBeenCalledWith({
        where: { userId: validParams.userId },
        update: { investType: validParams.investType },
        create: {
          userId: validParams.userId,
          investType: validParams.investType,
        },
      });

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { fullPath: { in: validParams.preferredCategories } },
        select: { id: true, fullPath: true },
      });

      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { userId: validParams.userId },
      });

      expect(mockCreateMany).toHaveBeenCalledWith({
        data: filteredCategories.map((category) => ({
          userId: validParams.userId,
          etfCategoryId: category.id,
        })),
      });
    });

    it('유효하지 않은 투자 성향에 대해 에러를 던진다', async () => {
      const invalidParams = {
        ...validParams,
        investType: 'INVALID_TYPE' as InvestType,
      };

      await expect(
        etfMbtiService.saveMbtiResult(invalidParams)
      ).rejects.toThrow('유효하지 않은 투자 성향입니다.');
    });

    it('빈 선호 카테고리에 대해 에러를 던진다', async () => {
      const invalidParams = {
        ...validParams,
        preferredCategories: [],
      };

      await expect(
        etfMbtiService.saveMbtiResult(invalidParams)
      ).rejects.toThrow('최소 하나의 선호 카테고리를 선택해주세요.');
    });

    it('존재하지 않는 카테고리에 대해 에러를 던진다', async () => {
      const invalidParams = {
        ...validParams,
        preferredCategories: ['존재하지않는카테고리'],
      };

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const mockTx = {
          investmentProfile: { upsert: jest.fn() },
          etfCategory: { findMany: jest.fn().mockResolvedValue([]) },
          userEtfCategory: {
            deleteMany: jest.fn(),
            createMany: jest.fn(),
          },
        };
        return await callback(mockTx as any);
      });

      mockPrisma.$transaction = mockTransaction;

      await expect(
        etfMbtiService.saveMbtiResult(invalidParams)
      ).rejects.toThrow('유효하지 않은 카테고리: 존재하지않는카테고리');
    });
  });

  describe('getUserInvestmentProfile', () => {
    it('정상적으로 사용자 투자 프로필을 반환한다', async () => {
      const userId = BigInt(5);
      mockPrisma.investmentProfile.findUnique.mockResolvedValue(
        mockInvestmentProfileResult
      );
      mockPrisma.user.findUnique.mockResolvedValue(mockUserEtfCategoriesResult);

      const result = await etfMbtiService.getUserInvestmentProfile(userId);

      expect(result).toEqual({
        investType: InvestType.CONSERVATIVE,
        preferredCategories: [
          { id: 6, fullPath: '주식-업종섹터-금융' },
          { id: 11, fullPath: '주식-업종섹터-정보기술' },
          { id: 10, fullPath: '주식-업종섹터-헬스케어' },
        ],
      });
    });

    it('프로필이 없을 때 investType=null, preferredCategories=[] 반환한다', async () => {
      const userId = BigInt(5);
      mockPrisma.investmentProfile.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await etfMbtiService.getUserInvestmentProfile(userId);

      expect(result).toEqual({
        investType: null,
        preferredCategories: [],
      });
    });
  });

  describe('validateRequestBody', () => {
    it('유효한 요청 데이터를 정상적으로 파싱한다', () => {
      const validRequest = createValidMbtiRequest();

      const result = EtfTestService.validateRequestBody(validRequest);

      expect(result).toEqual({
        investType: InvestType.MODERATE,
        preferredCategories: [
          '주식-업종섹터-금융',
          '주식-업종섹터-정보기술',
          '주식-업종섹터-헬스케어',
        ],
      });
    });

    it('빈 요청 본문에 대해 에러를 던진다', () => {
      expect(() => EtfTestService.validateRequestBody(null)).toThrow(
        '요청 본문이 유효하지 않습니다.'
      );
    });

    it('투자 성향이 없을 때 에러를 던진다', () => {
      const invalidRequest = {
        preferredCategories: ['주식-업종섹터-금융'],
      };

      expect(() => EtfTestService.validateRequestBody(invalidRequest)).toThrow(
        '투자 성향이 필요합니다.'
      );
    });

    it('선호 카테고리가 없을 때 에러를 던진다', () => {
      const invalidRequest = {
        investType: InvestType.MODERATE,
      };

      expect(() => EtfTestService.validateRequestBody(invalidRequest)).toThrow(
        '선호 카테고리가 필요합니다.'
      );
    });
  });
});
