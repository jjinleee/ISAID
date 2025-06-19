export interface QuizOption {
  label: string;
  value: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 중 예·적금의 특징이 아닌 것은?',
    options: [
      { label: '원금 보장', value: 'a', isCorrect: false },
      { label: '이자율 변동 가능', value: 'b', isCorrect: true },
      { label: '중도 해지 시 불이익', value: 'c', isCorrect: false },
      { label: '채권 시장에 상장', value: 'd', isCorrect: false },
    ],
    explanation: '예·적금은 채권이 아니므로 상장되지 않습니다.',
  },
  {
    id: 2,
    question: 'ETF의 장점으로 옳은 것을 모두 고르세요.',
    options: [
      { label: '저비용 운용', value: 'a', isCorrect: true },
      { label: '분산투자 효과', value: 'b', isCorrect: true },
      { label: '배당금 확정 지급', value: 'c', isCorrect: false },
      { label: '원금 보장', value: 'd', isCorrect: false },
    ],
    explanation: 'ETF는 저비용·분산투자가 가능하지만, 원금 보장은 없습니다.',
  },
  {
    id: 3,
    question: 'ISA(개인종합자산관리계좌)의 가입 가능 연령은?',
    options: [
      { label: '만 18세 이상', value: 'a', isCorrect: true },
      { label: '만 20세 이상', value: 'b', isCorrect: false },
      { label: '만 15세 이상', value: 'c', isCorrect: false },
      { label: '연령 무관', value: 'd', isCorrect: false },
    ],
    explanation: 'ISA는 만 18세 이상 개인이 가입할 수 있습니다.',
  },
  {
    id: 4,
    question: 'ETF 투자 시 주의해야 할 사항으로 적절하지 않은 것은?',
    options: [
      { label: '거래시간 중 실시간 매매 가능', value: 'a', isCorrect: false },
      {
        label: '기초지수 대비 추적오차 발생 가능',
        value: 'b',
        isCorrect: true,
      },
      { label: '분산투자 효과 활용', value: 'c', isCorrect: false },
      { label: '투자 원금이 보장됨', value: 'd', isCorrect: true },
    ],
    explanation: 'ETF는 투자원금 보장이 없으며, 추적오차가 발생할 수 있습니다.',
  },
];
