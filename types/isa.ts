export interface MonthlyReturn {
  [date: string]: number;
}

export interface MonthlyReturnsSummary {
  returns: MonthlyReturn[];
  evaluatedAmount: number;
  evaluatedProfit: number;
}

export interface AssetCategory {
  category: string;
  value: number;
  percentage: number;
}

export interface PieChartData {
  name: string;
  value: number;
}
