/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/etf/mbti/route';
import { InvestType } from '@prisma/client';
import {
  createMockEtfCategories,
  createMockSession,
  createValidMbtiRequest,
  mockInvestmentProfileResult,
  mockUserEtfCategoriesResult,
} from '../helpers/etf-test-helpers';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// lazy loading으로 prisma mock 설정
jest.mock('@/lib/prisma', () => {
  const { createPrismaMock } = require('@/__mocks__/prisma-factory');
  let mockPrisma: ReturnType<typeof createPrismaMock>;

  return {
    get prisma() {
      if (!mockPrisma) {
        mockPrisma = createPrismaMock();
      }
      return mockPrisma;
    },
    __resetMockPrisma() {
      mockPrisma = createPrismaMock();
      return mockPrisma;
    },
  };
});

const mockGetServerSession = getServerSession as jest.Mock;

const getMockPrisma = () => {
  const prismaMock = require('@/lib/prisma');
  return prismaMock.__resetMockPrisma();
};

describe('/api/etf/mbti', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = getMockPrisma();
  });

  describe('POST', () => {
    it('정상적으로 MBTI 결과를 저장한다', async () => {
      const mockSession = createMockSession('5');
      const validRequest = createValidMbtiRequest();
      const mockCategories = createMockEtfCategories();

      mockGetServerSession.mockResolvedValue(mockSession);

      const filteredCategories = mockCategories.filter((c) =>
        validRequest.preferredCategories.includes(c.fullPath)
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

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'POST',
        body: JSON.stringify(validRequest),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: '투자 성향 및 선호 카테고리 업데이트 성공',
      });

      expect(mockUpsert).toHaveBeenCalledWith({
        where: { userId: BigInt(mockSession.user.id) },
        update: { investType: validRequest.investType },
        create: {
          userId: BigInt(mockSession.user.id),
          investType: validRequest.investType,
        },
      });

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { fullPath: { in: validRequest.preferredCategories } },
        select: { id: true, fullPath: true },
      });

      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { userId: BigInt(mockSession.user.id) },
      });

      expect(mockCreateMany).toHaveBeenCalledWith({
        data: filteredCategories.map((category) => ({
          userId: BigInt(mockSession.user.id),
          etfCategoryId: category.id,
        })),
      });
    });

    it('인증되지 않은 사용자에 대해 401을 반환한다', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'POST',
        body: JSON.stringify(createValidMbtiRequest()),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: '인증된 사용자만 접근 가능합니다.' });
    });

    it('유효하지 않은 요청 데이터에 대해 400을 반환한다', async () => {
      const mockSession = createMockSession('1');
      mockGetServerSession.mockResolvedValue(mockSession);

      const invalidRequest = {
        investType: 'INVALID_TYPE',
        preferredCategories: [],
      };

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'POST',
        body: JSON.stringify(invalidRequest),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('유효하지 않은');
    });

    it('존재하지 않는 카테고리에 대해 400을 반환한다', async () => {
      const mockSession = createMockSession('1');
      mockGetServerSession.mockResolvedValue(mockSession);

      const invalidRequest = {
        investType: InvestType.MODERATE,
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

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'POST',
        body: JSON.stringify(invalidRequest),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('유효하지 않은 카테고리');
    });
  });

  describe('GET', () => {
    it('정상적으로 사용자 투자 프로필을 반환한다', async () => {
      const mockSession = createMockSession('1');

      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.investmentProfile.findUnique.mockResolvedValue(
        mockInvestmentProfileResult
      );
      mockPrisma.user.findUnique.mockResolvedValue(mockUserEtfCategoriesResult);

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        investType: InvestType.CONSERVATIVE,
        preferredCategories: [
          { id: 6, fullPath: '주식-업종섹터-금융' },
          { id: 11, fullPath: '주식-업종섹터-정보기술' },
          { id: 10, fullPath: '주식-업종섹터-헬스케어' },
        ],
      });
    });

    it('인증되지 않은 사용자에 대해 401을 반환한다', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ message: '인증된 사용자만 접근 가능합니다.' });
    });

    it('투자 프로필이 없을 때 404를 반환한다', async () => {
      const mockSession = createMockSession('1');
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.investmentProfile.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/etf/mbti', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ message: '투자 프로필이 없습니다.' });
    });
  });
});
