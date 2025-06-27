import { getServerSession } from 'next-auth';
import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    iSAAccount: {
      findUnique: jest.fn(),
    },
    monthlyReturn: {
      findMany: jest.fn(),
    },
    eTFHoldingSnapshot: {
      findMany: jest.fn(),
    },
    generalHoldingSnapshot: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// getMonthlyReturns 함수 테스트
// 목적: 세션, ISA 계좌 여부, ETF 및 일반 자산 평가금액을 기반으로 총 평가금액과 수익률을 계산하는지 검증

describe('getMonthlyReturns', () => {
  const mockUserId = 1;

  beforeEach(() => {
    jest.clearAllMocks(); // 모든 mock 초기화
    // 기본 세션 및 ISA 계좌 모킹 함수
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: mockUserId.toString() },
    });
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      id: mockUserId,
    });
  });

  // 헬퍼 함수: 기본 모킹 세팅 변경
  function setupMockData({
    session,
    isaAccount,
    monthlyReturns,
    etfSnapshots,
    generalSnapshot,
  }: {
    session?: any;
    isaAccount?: any;
    monthlyReturns?: any[];
    etfSnapshots?: any[];
    generalSnapshot?: any;
  }) {
    if (session !== undefined) {
      (getServerSession as jest.Mock).mockResolvedValue(session);
    }
    if (isaAccount !== undefined) {
      (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue(isaAccount);
    }
    if (monthlyReturns !== undefined) {
      (prisma.monthlyReturn.findMany as jest.Mock).mockResolvedValue(
        monthlyReturns
      );
    }
    if (etfSnapshots !== undefined) {
      (prisma.eTFHoldingSnapshot.findMany as jest.Mock).mockResolvedValue(
        etfSnapshots
      );
    }
    if (generalSnapshot !== undefined) {
      (prisma.generalHoldingSnapshot.aggregate as jest.Mock).mockResolvedValue(
        generalSnapshot
      );
    }
  }

  // 헬퍼 함수: 월별 수익률 객체 생성
  function createMockMonthlyReturn(entireProfit: number) {
    return { baseDate: new Date('2025-06-30T00:00:00Z'), entireProfit };
  }

  // 헬퍼 함수: ETF 스냅샷 객체 생성
  function createMockETFSnapshot(evaluatedAmount: number, etfId = 1) {
    return { evaluatedAmount, snapshotDate: new Date(), etfId };
  }

  // 헬퍼 함수: 일반 스냅샷 객체 생성
  function createMockGeneralSnapshot(evaluatedAmount: number) {
    return { _sum: { evaluatedAmount } };
  }

  // 헬퍼 함수: 예상 값 계산
  function calculateExpectedValues(etfAmount: number, generalAmount: number) {
    const totalAmount = etfAmount + generalAmount;
    const invested = 17000000; // 고정 투자원금
    const profit = totalAmount - invested;
    return { totalAmount, profit };
  }

  describe('에러 케이스', () => {
    it('로그인하지 않은 경우 오류를 발생시킵니다', async () => {
      // given
      setupMockData({ session: null });

      // when & then
      await expect(getMonthlyReturns('6')).rejects.toThrow(
        '로그인이 필요합니다.'
      );
    });

    it('ISA 계좌가 없을 때 오류를 발생시킵니다', async () => {
      // given
      setupMockData({ isaAccount: null });

      // when & then
      await expect(getMonthlyReturns('6')).rejects.toThrow(
        'ISA 계좌가 없습니다.'
      );
    });
  });

  describe('정확한 평가금액 및 평가수익 계산', () => {
    it('ETF 500만원 + 일반 1200만원 → 총 1700만원, 평가수익 0원', async () => {
      // given
      const etfAmount = 5_000_000;
      const generalAmount = 12_000_000;
      const { totalAmount, profit } = calculateExpectedValues(
        etfAmount,
        generalAmount
      );

      setupMockData({
        monthlyReturns: [createMockMonthlyReturn(0.12)],
        etfSnapshots: [createMockETFSnapshot(etfAmount)],
        generalSnapshot: createMockGeneralSnapshot(generalAmount),
      });

      // when
      const result = await getMonthlyReturns('6');

      // then
      expect(result.evaluatedAmount).toBe(totalAmount);
      expect(result.evaluatedProfit).toBe(profit);
      expect(result).toEqual({
        returns: [{ '2025-06-30': 12.0 }],
        evaluatedAmount: totalAmount,
        evaluatedProfit: profit,
      });
    });

    it('ETF 600만원 + 일반 1400만원 → 총 2000만원, 평가수익 300만원', async () => {
      // given
      const etfAmount = 6_000_000;
      const generalAmount = 14_000_000;
      const { totalAmount, profit } = calculateExpectedValues(
        etfAmount,
        generalAmount
      );

      setupMockData({
        monthlyReturns: [createMockMonthlyReturn(0.15)],
        etfSnapshots: [createMockETFSnapshot(etfAmount)],
        generalSnapshot: createMockGeneralSnapshot(generalAmount),
      });

      // when
      const result = await getMonthlyReturns('6');

      // then
      expect(result.evaluatedAmount).toBe(totalAmount);
      expect(result.evaluatedProfit).toBe(profit);
      expect(result).toEqual({
        returns: [{ '2025-06-30': 15.0 }],
        evaluatedAmount: totalAmount,
        evaluatedProfit: profit,
      });
    });
  });

  describe('수익률 공식 검증', () => {
    it('수익률 공식 (E - B - C) / (B + 0.5 * C) 계산을 실제 테스트 코드에서 검증', async () => {
      // given
      const B = 15_000_000;
      const C = 1_000_000;
      const E = 17_500_000;

      const expectedRate = (E - B - C) / (B + 0.5 * C);
      const expectedPercent = Number((expectedRate * 100).toFixed(2)); // 9.68

      const etfAmount = 10_000_000;
      const generalAmount = 7_500_000;

      setupMockData({
        monthlyReturns: [createMockMonthlyReturn(expectedRate)],
        etfSnapshots: [createMockETFSnapshot(etfAmount)],
        generalSnapshot: createMockGeneralSnapshot(generalAmount),
      });

      // when
      const result = await getMonthlyReturns('6');

      // then
      expect(result.returns).toEqual([{ '2025-06-30': expectedPercent }]);
      expect(result.evaluatedAmount).toBe(E);
    });
  });

  describe('다양한 시나리오 테스트', () => {
    it('ETF만 있고 일반 자산이 없는 경우', async () => {
      // given
      const etfAmount = 8_000_000;
      const generalAmount = 0;
      const { totalAmount, profit } = calculateExpectedValues(
        etfAmount,
        generalAmount
      );

      setupMockData({
        monthlyReturns: [createMockMonthlyReturn(0.1)],
        etfSnapshots: [createMockETFSnapshot(etfAmount)],
        generalSnapshot: createMockGeneralSnapshot(generalAmount),
      });

      // when
      const result = await getMonthlyReturns('6');

      // then
      expect(result.evaluatedAmount).toBe(totalAmount);
      expect(result.evaluatedProfit).toBe(profit);
    });

    it('일반 자산만 있고 ETF가 없는 경우', async () => {
      // given
      const etfAmount = 0;
      const generalAmount = 9_000_000;
      const { totalAmount, profit } = calculateExpectedValues(
        etfAmount,
        generalAmount
      );

      setupMockData({
        monthlyReturns: [createMockMonthlyReturn(0.08)],
        etfSnapshots: [],
        generalSnapshot: createMockGeneralSnapshot(generalAmount),
      });

      // when
      const result = await getMonthlyReturns('6');

      // then
      expect(result.evaluatedAmount).toBe(totalAmount);
      expect(result.evaluatedProfit).toBe(profit);
    });

    it('여러 개의 ETF 스냅샷이 있는 경우', async () => {
      // given
      const etfSnapshots = [
        createMockETFSnapshot(3_000_000, 1),
        createMockETFSnapshot(2_000_000, 2),
        createMockETFSnapshot(1_500_000, 3),
      ];
      const generalAmount = 10_500_000;
      const totalEtfAmount = 6_500_000;
      const { totalAmount, profit } = calculateExpectedValues(
        totalEtfAmount,
        generalAmount
      );

      setupMockData({
        monthlyReturns: [createMockMonthlyReturn(0.12)],
        etfSnapshots,
        generalSnapshot: createMockGeneralSnapshot(generalAmount),
      });

      // when
      const result = await getMonthlyReturns('6');

      // then
      expect(result.evaluatedAmount).toBe(totalAmount);
      expect(result.evaluatedProfit).toBe(profit);
    });
  });
});
