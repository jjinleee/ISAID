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

describe('getMonthlyReturns', () => {
  const mockUserId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    // 로그인된 사용자 세션을 모킹, user.id를 문자열로 설정
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: mockUserId.toString() },
    });
  });

  it('로그인하지 않은 경우 오류를 발생시킵니다', async () => {
    // 로그인 세션이 없을 경우 null 반환하도록 모킹
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    // getMonthlyReturns 호출 시 "로그인이 필요합니다." 오류가 발생하는지 검증
    await expect(getMonthlyReturns('6')).rejects.toThrow(
      '로그인이 필요합니다.'
    );
  });

  it('ISA 계좌가 없을 때 오류를 발생시킵니다', async () => {
    // ISA 계좌 조회 시 null 반환하도록 모킹하여 계좌가 없음을 시뮬레이션
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue(null);
    // getMonthlyReturns 호출 시 "ISA 계좌가 없습니다." 오류가 발생하는지 검증
    await expect(getMonthlyReturns('6')).rejects.toThrow(
      'ISA 계좌가 없습니다.'
    );
  });

  describe('정확한 평가금액 및 평가수익 계산', () => {
    //isa 계좌 존재조건 모킹
    beforeEach(() => {
      (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
        id: mockUserId,
      });
    });

    it('ETF 500만원 + 일반 1200만원 → 총 1700만원, 평가수익 0원', async () => {
      //수익률 모킹
      (prisma.monthlyReturn.findMany as jest.Mock).mockResolvedValue([
        { baseDate: new Date('2025-06-30T00:00:00Z'), entireProfit: 0.12 },
      ]);
      //ETF 스냅샷 평가금액
      (prisma.eTFHoldingSnapshot.findMany as jest.Mock).mockResolvedValue([
        { evaluatedAmount: 5000000, snapshotDate: new Date(), etfId: 1 },
      ]);
      //general 평가금액
      (prisma.generalHoldingSnapshot.aggregate as jest.Mock).mockResolvedValue({
        _sum: { evaluatedAmount: 12000000 },
      });

      //계산검증
      const res = await getMonthlyReturns('6');

      console.log('getMonthlyReturns 실행 결과:', res);
      expect(prisma.iSAAccount.findUnique).toHaveBeenCalled();
      expect(prisma.monthlyReturn.findMany).toHaveBeenCalled();
      expect(prisma.eTFHoldingSnapshot.findMany).toHaveBeenCalled();
      expect(prisma.generalHoldingSnapshot.aggregate).toHaveBeenCalled();

      const etf = 5000000;
      const general = 12000000;
      const total = etf + general;
      const invested = 17000000; //투자원금
      const profit = total - invested;

      expect(res.evaluatedAmount).toBe(total);
      expect(res.evaluatedProfit).toBe(profit);
      expect(res).toEqual({
        returns: [{ '2025-06-30': 12.0 }],
        evaluatedAmount: 17000000,
        evaluatedProfit: 0,
      });
    });

    it('ETF 600만원 + 일반 1400만원 → 총 2000만원, 평가수익 300만원', async () => {
      (prisma.monthlyReturn.findMany as jest.Mock).mockResolvedValue([
        { baseDate: new Date('2025-06-30T00:00:00Z'), entireProfit: 0.15 },
      ]);
      (prisma.eTFHoldingSnapshot.findMany as jest.Mock).mockResolvedValue([
        { evaluatedAmount: 6000000, snapshotDate: new Date(), etfId: 1 },
      ]);
      (prisma.generalHoldingSnapshot.aggregate as jest.Mock).mockResolvedValue({
        _sum: { evaluatedAmount: 14000000 },
      });

      const res = await getMonthlyReturns('6');

      console.log('getMonthlyReturns 실행 결과:', res);
      expect(prisma.iSAAccount.findUnique).toHaveBeenCalled();
      expect(prisma.monthlyReturn.findMany).toHaveBeenCalled();
      expect(prisma.eTFHoldingSnapshot.findMany).toHaveBeenCalled();
      expect(prisma.generalHoldingSnapshot.aggregate).toHaveBeenCalled();

      const etf = 6000000;
      const general = 14000000;
      const total = etf + general;
      const invested = 17000000;
      const profit = total - invested;

      expect(res.evaluatedAmount).toBe(total);
      expect(res.evaluatedProfit).toBe(profit);
      expect(res).toEqual({
        returns: [{ '2025-06-30': 15.0 }],
        evaluatedAmount: total,
        evaluatedProfit: profit,
      });
    });

    // 수익률 수식 테스트

    // - E (평가금액), B (투자원금), C (중간 입금액) 값을 모킹
    // - expectedRate = (E - B - C) / (B + 0.5 * C) 계산
    // - entireProfit으로 모킹한 수익률이 계산 수식과 일치하는지 테스트
    // - returns 값이 수식에 따라 계산된 9.68%와 일치하는지 확인

    it('수익률 공식 (E - B - C) / (B + 0.5 * C) 계산을 실제 테스트 코드에서 검증', async () => {
      // ISA 계좌 mock
      (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
        id: mockUserId,
      });

      // 수익률: (17.5M - 15M - 1M) / (15M + 0.5M) = 1.5M / 15.5M ≈ 0.0968 (9.68%)
      const B = 15000000;
      const C = 1000000;
      const E = 17500000;

      const expectedRate = (E - B - C) / (B + 0.5 * C);
      const expectedPercent = Number((expectedRate * 100).toFixed(2)); // 9.68

      // 수익률 값 mocking
      (prisma.monthlyReturn.findMany as jest.Mock).mockResolvedValue([
        {
          baseDate: new Date('2025-06-30T00:00:00Z'),
          entireProfit: expectedRate,
        },
      ]);

      // ETF 평가금액 E의 일부
      (prisma.eTFHoldingSnapshot.findMany as jest.Mock).mockResolvedValue([
        { evaluatedAmount: 10000000, snapshotDate: new Date(), etfId: 1 },
      ]);

      // 일반 + 현금 E의 일부
      (prisma.generalHoldingSnapshot.aggregate as jest.Mock).mockResolvedValue({
        _sum: { evaluatedAmount: 7500000 },
      });

      const res = await getMonthlyReturns('6');

      console.log('getMonthlyReturns 실행 결과:', res);
      expect(prisma.iSAAccount.findUnique).toHaveBeenCalled();
      expect(prisma.monthlyReturn.findMany).toHaveBeenCalled();
      expect(prisma.eTFHoldingSnapshot.findMany).toHaveBeenCalled();
      expect(prisma.generalHoldingSnapshot.aggregate).toHaveBeenCalled();

      expect(res.returns).toEqual([{ '2025-06-30': expectedPercent }]);
      expect(res.evaluatedAmount).toBe(E);
    });
  });
});
