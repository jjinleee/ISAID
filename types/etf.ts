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
