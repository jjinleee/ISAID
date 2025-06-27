import { getServerSession } from 'next-auth';
import { getISAPortfolio } from '@/app/actions/get-isa-portfolio';
import { prisma } from '@/lib/prisma';

// next-auth의 getServerSession 함수 모킹
jest.mock('next-auth');
// prisma 클라이언트의 iSAAccount 모델 모킹
jest.mock('@/lib/prisma', () => ({
  prisma: {
    iSAAccount: {
      findUnique: jest.fn(),
    },
  },
}));

describe('getISAPortfolio', () => {
  // 각 테스트 전 모킹된 함수들의 호출 기록 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 세션이 없을 경우 'Unauthorized' 에러가 발생하는지 테스트
  it('throws if no session is found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    await expect(getISAPortfolio('2025-06')).rejects.toThrow('Unauthorized');
  });

  // ISA 계좌에서 각 자산의 비율이 정확히 계산되는지 검증
  it('returns correct portfolio breakdown', async () => {
    // 로그인된 유저 세션 모킹
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: '1' },
    });

    // prisma iSAAccount.findUnique 함수가 반환할 모킹 데이터 설정
    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      generalHoldingSnapshots: [],
      generalHoldings: [
        {
          totalCost: 1000000,
          product: { instrumentType: 'BOND' },
        },
        {
          totalCost: 2000000,
          product: { instrumentType: 'FUND' },
        },
        {
          totalCost: 3000000,
          product: { instrumentType: 'ELS' },
        },
      ],
      etfHoldingSnapshots: [
        {
          evaluatedAmount: 4000000,
          etf: { idxMarketType: '국내' },
        },
        {
          evaluatedAmount: 5000000,
          etf: { idxMarketType: '해외' },
        },
        {
          evaluatedAmount: 6000000,
          etf: { idxMarketType: '국내&해외' },
        },
      ],
    });

    // 실제 함수 호출 및 결과 저장
    const result = await getISAPortfolio('2025-06');

    // 반환된 포트폴리오가 예상한 카테고리별 금액과 비율로 정확히 계산되었는지 검증
    expect(result).toEqual([
      { category: '채권', value: 1000000, percentage: 4.8 },
      { category: '펀드', value: 2000000, percentage: 9.5 },
      { category: 'ELS', value: 3000000, percentage: 14.3 },
      { category: '국내 ETF', value: 4000000, percentage: 19.0 },
      { category: '해외 ETF', value: 5000000, percentage: 23.8 },
      { category: '국내&해외 ETF', value: 6000000, percentage: 28.6 },
    ]);
  });

  // 반환된 포트폴리오의 전체 구조가 스냅샷과 일치하는지 확인
  it('matches snapshot for consistent portfolio structure', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });

    (prisma.iSAAccount.findUnique as jest.Mock).mockResolvedValue({
      generalHoldingSnapshots: [],
      generalHoldings: [
        {
          totalCost: 1000000,
          product: { instrumentType: 'BOND' },
        },
        {
          totalCost: 2000000,
          product: { instrumentType: 'FUND' },
        },
        {
          totalCost: 3000000,
          product: { instrumentType: 'ELS' },
        },
      ],
      etfHoldingSnapshots: [
        {
          evaluatedAmount: 4000000,
          etf: { idxMarketType: '국내' },
        },
        {
          evaluatedAmount: 5000000,
          etf: { idxMarketType: '해외' },
        },
        {
          evaluatedAmount: 6000000,
          etf: { idxMarketType: '국내&해외' },
        },
      ],
    });

    const result = await getISAPortfolio('2025-06');
    expect(result).toMatchSnapshot();
  });
});
