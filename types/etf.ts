export interface Category {
  displayName: string;
  categories: SubCategory[];
}
export interface SubCategory {
  id: number;
  name: string;
  fullname: string;
}

export interface EtfApiItem {
  etfId: string;
  issueCode: string;
  issueName: string;
  accTradeVolume: number;
  tddClosePrice: string;
  flucRate: string;
}

export interface EtfApiResponse {
  data: EtfApiItem[];
  total: number;
  etfCategoryFullPath: string;
}

export type Filter = 'name' | 'code';

export interface EtfIntro {
  date: string; // 기준일(YYYY-MM-DD)
  category: string; // 대분류-소분류
  issueName: string; // ETF 이름
  issueCode: string; // 종목 코드
  flucRate: string; // 등락률(%, 기호 없음)
  todayClose: number; // 금일 종가
  prevClose: number; // 전일 종가
  tradeVolume: number; // 거래량
  iNav: number; // iNAV 값
}

export interface EtfDetail {
  comAbbrv: string; // 운용사(약칭)
  listDate: string; // 상장일(ISO)
  etfObjIndexName: string; // 추종 지수명
  taxType: string; // 과세 방식
  etfReplicationMethod: string; // 펀드 복제 방식
  idxMarketType: string; // 지수 시장 구분
  idxAssetType: string; // 지수 자산 유형
  etfTotalFee: string; // 총 보수(%)
  marketCap: number; // 시가총액(원)
  nav: string; // 순자산가치(NAV)
  listShrs: number; // 발행 좌수
}

export interface EtfDetailResponse {
  EtfIntro: EtfIntro; // 헤더 정보
  EtfDetail: EtfDetail; // 상세 정보
}

export interface RatioInfo {
  compstIssueCu1Shares: string;
  compstIssueName: string;
  compstRatio: string | null;
}

export interface EtfCardProps {
  etfId: string;
  flucRate: number;
  issueName: string;
  riskGrade: number;
  reasons: ReasonProps[];
  onClick?: () => void;
}

export interface ReasonProps {
  title: string;
  description: string;
}
