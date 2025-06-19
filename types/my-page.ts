export interface ChartData {
  id: string;
  name: string;
  value: number;
}

export type Account = {
  id: string;
  userId: string;
  bankCode:
    | '하나증권'
    | '미래에셋증권'
    | '삼성증권'
    | 'NH투자증권'
    | '한국투자증권'
    | '키움증권'
    | '신한투자증권'
    | 'KB증권';
  accountNum: string;
  connectedAt: string;
  currentBalance: number;
  accountType: string;
};
