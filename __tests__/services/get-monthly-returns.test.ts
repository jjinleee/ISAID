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

  it('정확하게 계산된 수익률과 평가 손익을 반환합니다', async () => {
    // ISA 계좌가 존재하는 경우를 모킹, id는 mockUserId로 설정
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      id: mockUserId,
    });

    // 월별 수익률 데이터 모킹, 특정 날짜와 수익률 0.12 (12%) 반환
    (prisma.monthlyReturn.findMany as jest.Mock).mockResolvedValue([
      { baseDate: new Date('2025-06-30T00:00:00Z'), entireProfit: 0.12 },
    ]);

    // ETF 보유 스냅샷 데이터 모킹, 평가 금액 5,000,000원 반환
    (prisma.eTFHoldingSnapshot.findMany as jest.Mock).mockResolvedValue([
      { evaluatedAmount: 5000000, snapshotDate: new Date(), etfId: 1 },
    ]);

    // 일반 보유 스냅샷의 평가 금액 합계 모킹, 12,000,000원 반환
    (prisma.generalHoldingSnapshot.aggregate as jest.Mock).mockResolvedValue({
      _sum: { evaluatedAmount: 12000000 },
    });

    // getMonthlyReturns 함수 호출 결과를 변수에 저장
    const result = await getMonthlyReturns('6');

    // ETF와 일반 평가금액이 각각 정확히 반영되었는지 검증
    expect(result.evaluatedAmount).toBe(5000000 + 12000000);
    expect(result.evaluatedProfit).toBe(0);

    // 반환된 결과가 기대한 수익률과 평가 금액, 평가 손익과 일치하는지 검증
    expect(result).toEqual({
      returns: [{ '2025-06-30': 12.0 }],
      evaluatedAmount: 17000000,
      evaluatedProfit: 0,
    });
  });
});
