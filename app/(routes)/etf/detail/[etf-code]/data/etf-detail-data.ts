export type EtfDetail = {
  name: string;
  code: string;
  price: number;
  rate: number;
  categoryId: string; // ex) '주식-업종섹터'
  company: string; // 운용사
  listedDate: string; // 상장일
  index: string; // 기초지수
  marketCap: string; // 시가총액
  netAsset: string; // 순자산
  totalShares: string; // 상장주식수
  holdingsCount: string; // 구성종목수
  nav: string; // 전일 NAV
  fundType: string; // 펀드형태
  taxType: string; // 과세유형
  replicationMethod: string; // 복제방법
  // 헤더에 있는 정보
  iNav: number; // iNAV 값
  iNavRate: number; // 그 옆에 등락율
  volume: number; // 거래량
};

export const etfDetailMap = {
  '123456': {
    name: 'TIGER 성장 ETF',
    code: '123456',
    price: 9300,
    rate: 5.68,
    categoryId: '주식-전략',
    company: '미래에셋',
    listedDate: '2023.03.15',
    index: 'KOSPI 성장지수',
    marketCap: '1,200억원(320위)',
    netAsset: '1,180억원(319위)',
    totalShares: '10,000,000주',
    holdingsCount: '50종목',
    nav: '12,480.25',
    fundType: '수익증권형',
    taxType: '비과세',
    replicationMethod: '실물(패시브)',
    fee: '0.25%',
    assetSize: '1,200억원',
    iNav: 9417,
    iNavRate: 5.71,
    volume: 1953653,
  },
  '234567': {
    name: 'KODEX 고배당 ETF',
    code: '234567',
    price: 12300,
    rate: -9.8,
    categoryId: '주식-전략',
    company: '삼성자산운용',
    listedDate: '2022.11.10',
    index: '고배당주지수',
    marketCap: '900억원',
    netAsset: '920억원',
    totalShares: '9,200,000주',
    holdingsCount: '35종목',
    nav: '10,850.75',
    fundType: '수익증권형',
    taxType: '비과세',
    replicationMethod: '실물(패시브)',
    fee: '0.19%',
    assetSize: '900억원',
    iNav: 12123,
    iNavRate: -4.8,
    volume: 8213123,
  },
};
