export type MissionStatus = 'completed' | 'available' | 'pending';

export interface Mission {
  id: number;
  title: string;
  description: string;
  reward: string;
  status: MissionStatus;
  icon: string;
}
export const iconList = [
  { id: '34', icon: '/images/challenge/icon-streak-checkin.svg' },
  { id: '39', icon: '/images/challenge/icon-quiz-checkin.svg' },
  { id: '40', icon: '/images/challenge/icon-first-risk-test.svg' },
  { id: '41', icon: '/images/challenge/icon-connect-isa.svg' },
  { id: '42', icon: '/images/challenge/icon-own-3-etfs.svg' },
  { id: '43', icon: '/images/challenge/icon-hold-isa-500days.svg' },
  { id: '44', icon: '/images/challenge/icon-view-ai-portfolio.svg' },
  { id: '45', icon: '/images/challenge/icon-investment-dna-test.svg' },
  { id: '46', icon: '/images/challenge/icon-annual-deposit-over-1m.svg' },
];

export const challengeList: Mission[] = [
  {
    id: 1,
    title: '연속 출석',
    description: '7일 연속으로 출석하면',
    reward: '1Q 미국 S&P 500 0.1주 지급',
    status: 'completed',
    icon: '/images/challenge/icon-streak-checkin.svg',
  },
  {
    id: 2,
    title: '출석체크 금융 퀴즈',
    description: '오늘의 금융 퀴즈를 풀면',
    reward: '1Q 미국 S&P 500 0.02주 지급',
    status: 'completed',
    icon: '/images/challenge/icon-quiz-checkin.svg',
  },
  {
    id: 3,
    title: '첫 투자성향 테스트',
    description: '처음으로 투자성향 테스트를 하면',
    reward: '1Q 차이나백 0.065주 지급',
    status: 'available',
    icon: '/images/challenge/icon-first-risk-test.svg',
  },
  {
    id: 4,
    title: '첫 ISA 계좌 연결',
    description: '처음으로 ISA 계좌 연결하면',
    reward: '1Q 코리아백 0.084주 지급',
    status: 'available',
    icon: '/images/challenge/icon-connect-isa.svg',
  },
  {
    id: 5,
    title: '보유 ETF 3종목 이상',
    description: '서로 다른 ETF 3종 이상 보유하면',
    reward: '1Q 미국빅테크 30 0.115주 지급',
    status: 'pending',
    icon: '/images/challenge/icon-own-3-etfs.svg',
  },
  {
    id: 6,
    title: '계좌 보유 기간 500일 달성',
    description: 'ISA 계좌를 보유한지 500일을 달성하면',
    reward: 'Q S&P 500 0.3주 지급',
    status: 'available',
    icon: '/images/challenge/icon-hold-isa-500days.svg',
  },
  {
    id: 7,
    title: '하나 원큐 AI포트폴리오 조회',
    description: '하나은행의 AI추천 신탁/일임형 포트폴리오 조회',
    reward: '1Q 미국빅테크 30 0.27주 지급',
    status: 'available',
    icon: '/images/challenge/icon-view-ai-portfolio.svg',
  },
  {
    id: 8,
    title: '하나 원큐 ‘투자 DNA’ 테스트',
    description: '하나 원큐의 투자 dna 테스트를 하면',
    reward: '1Q K200 0.09주 지급',
    status: 'available',
    icon: '/images/challenge/icon-investment-dna-test.svg',
  },
  {
    id: 9,
    title: '유형 전환',
    description: '하나은행 ISA 일임형/신탁형 유형으로 전환하면',
    reward: 'Q 미국 S&P 500 0.3주 지급',
    status: 'available',
    icon: '/images/challenge/icon-switch-isa-type.svg',
  },
  {
    id: 10,
    title: '연간 납입 한도 100만원 이상',
    description: '연간 납입한도 100만원 이상 납입하면',
    reward: '1Q 미국 S&P 500 0.27주 지급',
    status: 'available',
    icon: '/images/challenge/icon-annual-deposit-over-1m.svg',
  },
];
