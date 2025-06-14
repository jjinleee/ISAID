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
  {
    name: 'TIGER 성장 ETF',
    code: '123456',
    volume: '1,200,000',
    price: '12,800',
    changeRate: '+1.42%',
  },
  {
    name: 'KODEX 배당 ETF',
    code: '234567',
    volume: '890,000',
    price: '10,250',
    changeRate: '-0.85%',
  },
];
