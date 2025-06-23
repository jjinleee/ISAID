export interface MonthlyReturn {
  [date: string]: number;
}

export interface MonthlyReturnsSummary {
  returns: MonthlyReturn[];
  evaluatedAmount: number;
  evaluatedProfit: number;
}
