export interface EtfCardProps {
  issueName: string;
  riskGrade: number;
  reasons: ReasonProps[];
  onClick?: () => void;
}

export interface ReasonProps {
  title: string;
  desc: string;
}

export const etfCardDummyData: EtfCardProps[] = [
  {
    issueName: 'KODEX 200',
    riskGrade: 2,
    reasons: [
      {
        title: '낮은 총보수',
        desc: '총보수가 0.3% 미만으로 낮아, 장기 투자 시 비용 부담을 줄이고 실질 수익률을 높일 수 있습니다.',
      },
      {
        title: '운용 안정성',
        desc: '순자산총액이 1,000억 원 이상으로, 대형 ETF로서 투자자 신뢰도와 안정적인 운용이 가능합니다.',
      },
    ],
    onClick: () => console.log('KODEX 200 클릭'),
  },
  {
    issueName: 'TIGER 미국S&P500',
    riskGrade: 3,
    reasons: [
      {
        title: '운용 안정성',
        desc: '순자산총액이 1조 원 이상으로 운용 안정성이 뛰어납니다.',
      },
      {
        title: '낮은 괴리율',
        desc: '괴리율이 ±0.5% 이내로 낮아, 시장가격과 NAV가 거의 일치합니다. 합리적인 매수·매도가 가능합니다.',
      },
    ],
    onClick: () => console.log('TIGER 미국S&P500 클릭'),
  },
  {
    issueName: 'ACE 나스닥100',
    riskGrade: 4,
    reasons: [
      {
        title: '높은 유동성',
        desc: '일일 평균 거래대금이 10억원 이상으로, 매수·매도가 원활합니다. 단기 매매 전략에 적합합니다.',
      },
      {
        title: '시장 대표성',
        desc: '나스닥100 지수를 추종하여 미국 대표 기술주에 투자할 수 있는 ETF입니다.',
      },
    ],
    onClick: () => console.log('ACE 나스닥100 클릭'),
  },
  {
    issueName: 'KODEX 단기채권',
    riskGrade: 1,
    reasons: [
      {
        title: '초저위험 등급',
        desc: '리스크 등급 5로 가격 변동성이 낮고 안정적인 운용이 기대됩니다.',
      },
      {
        title: '단기 보유 적합',
        desc: '채권 중심 포트폴리오로 단기 자금 운용에 유리합니다.',
      },
    ],
    onClick: () => console.log('KODEX 단기채권 클릭'),
  },
  {
    issueName: 'TIGER 인버스',
    riskGrade: 5,
    reasons: [
      {
        title: '고위험 전략',
        desc: '하락장에서 수익을 추구하는 인버스 전략 ETF로, 고위험·고수익을 선호하는 투자자에게 적합합니다.',
      },
      {
        title: '높은 유동성',
        desc: '일일 평균 거래대금이 높아, 단기 트레이딩에 활용하기 좋습니다.',
      },
    ],
    onClick: () => console.log('TIGER 인버스 클릭'),
  },
];
