export interface MonthlyReturn {
  [date: string]: number;
}

export interface MonthlyEvaluatedAmount {
  [date: string]: number;
}

export interface MonthlyDetail {
  date: string;
  etfAmount: number;
  generalAmount: number;
  totalAmount: number;
}

export interface MonthlyReturnsSummary {
  returns: MonthlyReturn[];
  monthlyEvaluatedAmounts: MonthlyEvaluatedAmount[];
  evaluatedAmount: number;
  evaluatedProfit: number;
  monthlyDetails: MonthlyDetail[];
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
export interface RebalancingResponse {
  recommendedPortfolio: RecommendedPortfolioData[];
  score: number;
  rebalancingOpinions: RebalancingOpinionData[];
}

export interface RecommendedPortfolioData {
  category: string;
  percentage: number;
}

export interface RebalancingOpinionData {
  category: string;
  userPercentage: number;
  recommendedPercentage: number;
  opinion: string;
  detail: string;
}
