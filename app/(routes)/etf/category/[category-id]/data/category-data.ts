export type CategoryId =
  | 'market-core'
  | 'industry'
  | 'strategy'
  | 'market-cap'
  | 'mixed-assets';

export interface Category {
  displayName: string;
  subCategories: string[];
}

export const categoryMap: Record<CategoryId, Category> = {
  'market-core': {
    displayName: '주식-시장대표',
    subCategories: [],
  },
  industry: {
    displayName: '주식-업종섹터',
    subCategories: [
      '건설',
      '중공업',
      '산업재',
      '금융',
      '에너지화학',
      '경기소비재',
      '생활소비재',
      '헬스케어',
      '정보기술',
      '철강소재',
      '업종테마',
      '커뮤니케이션서비스',
      '기타',
    ],
  },
  strategy: {
    displayName: '주식-전략',
    subCategories: [
      '가치',
      '성장',
      '배당',
      '변동성',
      '구조화',
      '기업그룹',
      '전략테마',
      '혼합/퀀트',
    ],
  },
  'market-cap': {
    displayName: '주식-규모',
    subCategories: ['대형주', '중형주'],
  },
  'mixed-assets': {
    displayName: '혼합자산',
    subCategories: ['주식+채권', '기타'],
  },
};

export const etfData = [
  // TIGER
  {
    name: 'TIGER 성장 ETF',
    code: '123456',
    company: '미래에셋',
    volume: '1,200,000',
    price: '12,800',
    changeRate: '+1.42%',
  },
  {
    name: 'TIGER 미국테크 TOP10 ETF',
    code: '123457',
    company: '미래에셋',
    volume: '950,000',
    price: '17,350',
    changeRate: '+0.67%',
  },

  // KODEX
  {
    name: 'KODEX 배당 ETF',
    code: '234567',
    company: '삼성자산운용',
    volume: '890,000',
    price: '10,250',
    changeRate: '-0.85%',
  },
  {
    name: 'KODEX 200 ETF',
    code: '234568',
    company: '삼성자산운용',
    volume: '1,450,000',
    price: '33,410',
    changeRate: '+0.28%',
  },

  // ACE
  {
    name: 'ACE 2차전지 테마 ETF',
    code: '345678',
    company: '키움투자운용',
    volume: '1,050,000',
    price: '15,640',
    changeRate: '+2.05%',
  },
  {
    name: 'ACE 미국리츠 ETF',
    code: '345679',
    company: '키움투자운용',
    volume: '420,000',
    price: '9,880',
    changeRate: '-0.37%',
  },

  // 1Q
  {
    name: '1Q 코스닥벤처 ETF',
    code: '456789',
    company: 'NH-Amundi',
    volume: '310,000',
    price: '7,420',
    changeRate: '-1.12%',
  },
  {
    name: '1Q 항공우주 ETF',
    code: '456790',
    company: 'NH-Amundi',
    volume: '270,000',
    price: '8,760',
    changeRate: '+1.26%',
  },
];
