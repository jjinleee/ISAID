export type EtfInfo = {
  name: string;
  avgPrice: number;
  totalPurchase: number;
  returnRate: number;
  quantity: number;
  portionOfTotal: number;
};

type EtfDetailMap = {
  [etfId: string]: EtfInfo;
};

export const etfDetailMap: EtfDetailMap = {
  '102030': {
    name: 'TIGER 미국S&P500',
    avgPrice: 11250, // 구매 평균 단가
    totalPurchase: 1125000, // 총 매입 금액 (11250 * 100)
    returnRate: 0.154, // 수익률 (15.4%)
    quantity: 100, // 보유 수량
    portionOfTotal: 0.25, // 총 투자 금액 중 비율 (25%)
  },
  '203040': {
    name: 'KODEX 2차전지산업',
    avgPrice: 21500,
    totalPurchase: 645000,
    returnRate: -0.042,
    quantity: 30,
    portionOfTotal: 0.14,
  },
  '304050': {
    name: 'ACE 글로벌반도체',
    avgPrice: 17900,
    totalPurchase: 716000,
    returnRate: 0.087,
    quantity: 40,
    portionOfTotal: 0.16,
  },
  '405060': {
    name: 'KODEX 배당가치',
    avgPrice: 9800,
    totalPurchase: 294000,
    returnRate: 0.023,
    quantity: 30,
    portionOfTotal: 0.06,
  },
  '506070': {
    name: 'TIGER 나스닥100',
    avgPrice: 15000,
    totalPurchase: 1050000,
    returnRate: 0.204,
    quantity: 70,
    portionOfTotal: 0.39,
  },
};
