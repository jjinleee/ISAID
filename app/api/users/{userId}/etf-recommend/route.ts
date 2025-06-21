// 샤프비율 -> etf.수익률 - 0.03 / etf.변동성
// 총보수 -> etf.etf_total_fee
// 거래대금 -> etf_daily_trading.acc_total_value
// 순자산총액 -> etf.net_asset_total_amount
// 추적오차 -> etf.trace_err_rate
// 괴리율 -> etf.divergence_rate
// 변동성 -> etf.volatility

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { InvestType } from '@prisma/client';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

interface EtfRecommendationRequest {
  limit?: number;
  categoryFilter?: string[];
  investType?:
    | 'CONSERVATIVE'
    | 'MODERATE'
    | 'NEUTRAL'
    | 'ACTIVE'
    | 'AGGRESSIVE';
}

interface EtfRecommendationResponse {
  etfId: string;
  issueCode: string;
  issueName: string;
  category: string;
  score: number;
  riskGrade: number; // 하나증권 위험등급 추가
  metrics: {
    sharpeRatio: number;
    totalFee: number;
    tradingVolume: number;
    netAssetValue: number;
    trackingError: number;
    divergenceRate: number;
    volatility: number;
    normalizedVolatility: number; // 정규화된 변동성 추가
  };
  reasons: string[];
}

// 하나증권 위험등급 분류 함수 (5단계)
function classifyRiskGrade(volatility: number): number {
  // 월간 변동성을 연간 변동성으로 변환
  const annualVolatility = volatility * Math.sqrt(12);

  // 하나증권 5단계 위험등급 기준
  if (annualVolatility <= 0.05) return 5; // 초저위험 (5등급)
  if (annualVolatility <= 0.1) return 4; // 저위험 (4등급)
  if (annualVolatility <= 0.15) return 3; // 중위험 (3등급)
  if (annualVolatility <= 0.2) return 2; // 고위험 (2등급)
  return 1; // 초고위험 (1등급)
}

// 위험등급별 대표 변동성 수치 반환
function getRepresentativeVolatility(riskGrade: number): number {
  const representativeValues = {
    1: 0.3, // 초고위험
    2: 0.2, // 고위험
    3: 0.15, // 중위험
    4: 0.1, // 저위험
    5: 0.05, // 초저위험
  };
  return (
    representativeValues[riskGrade as keyof typeof representativeValues] || 0.15
  );
}

// 샤프비율 계산 함수 (하나증권 기준 적용)
function calculateSharpeRatio(return1y: number, volatility: number): number {
  if (!volatility || volatility === 0) return 0;

  const riskFreeRate = 0.03; // 3% 무위험 수익률

  // 위험등급 분류
  const riskGrade = classifyRiskGrade(volatility);

  // 위험등급별 대표 변동성 수치 사용
  const representativeVolatility = getRepresentativeVolatility(riskGrade);

  // 샤프비율 계산 (대표 변동성 사용)
  return (return1y - riskFreeRate) / representativeVolatility;
}

// 투자 성향별 가중치 설정
function getRiskBasedWeights(investType: InvestType) {
  const weights = {
    CONSERVATIVE: {
      sharpeRatio: 0.1,
      totalFee: 0.3,
      tradingVolume: 0.2,
      netAssetValue: 0.2,
      trackingError: 0.05,
      divergenceRate: 0.05,
      volatility: 0.1,
    },
    MODERATE: {
      sharpeRatio: 0.15,
      totalFee: 0.25,
      tradingVolume: 0.15,
      netAssetValue: 0.15,
      trackingError: 0.05,
      divergenceRate: 0.1,
      volatility: 0.15,
    },
    NEUTRAL: {
      sharpeRatio: 0.2,
      totalFee: 0.2,
      tradingVolume: 0.15,
      netAssetValue: 0.15,
      trackingError: 0.05,
      divergenceRate: 0.15,
      volatility: 0.15,
    },
    ACTIVE: {
      sharpeRatio: 0.25,
      totalFee: 0.15,
      tradingVolume: 0.2,
      netAssetValue: 0.1,
      trackingError: 0.05,
      divergenceRate: 0.1,
      volatility: 0.15,
    },
    AGGRESSIVE: {
      sharpeRatio: 0.3,
      totalFee: 0.1,
      tradingVolume: 0.2,
      netAssetValue: 0.05,
      trackingError: 0.05,
      divergenceRate: 0.1,
      volatility: 0.2,
    },
  };

  return weights[investType] || weights.NEUTRAL;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

// 위험등급별 정규화된 변동성 계산
function normalizeVolatilityByRiskGrade(volatility: number): number {
  const riskGrade = classifyRiskGrade(volatility);

  // 위험등급별 정규화 (1등급=0.0, 5등급=1.0)
  // 안전한 ETF일수록 높은 점수
  return (6 - riskGrade) / 5;
}

// 추천 이유 생성 함수
function generateReasons(
  etf: any,
  metrics: any,
  investType: InvestType
): string[] {
  const reasons: string[] = [];

  // 샤프비율 기반 이유
  if (metrics.sharpeRatio > 1.0) {
    reasons.push('높은 샤프비율로 위험 대비 수익률이 우수합니다');
  }

  // 총보수 기반 이유
  if (metrics.totalFee < 0.3) {
    reasons.push('낮은 총보수로 비용 효율성이 좋습니다');
  }

  // 거래대금 기반 이유
  if (metrics.tradingVolume > 1000000000) {
    // 10억원 이상
    reasons.push('높은 거래대금으로 유동성이 우수합니다');
  }

  // 순자산총액 기반 이유
  if (metrics.netAssetValue > 100000000000) {
    // 1000억원 이상
    reasons.push('대규모 순자산으로 안정성이 높습니다');
  }

  // 추적오차 기반 이유
  if (metrics.trackingError < 0.5) {
    reasons.push('낮은 추적오차로 지수 추종 성능이 우수합니다');
  }

  // 괴리율 기반 이유
  if (Math.abs(metrics.divergenceRate) < 0.5) {
    reasons.push('낮은 괴리율로 NAV 대비 가격이 안정적입니다');
  }

  // 위험등급 기반 이유 (하나증권 기준)
  const riskGrade = classifyRiskGrade(metrics.volatility);
  const riskGradeLabels = {
    1: '초고위험',
    2: '고위험',
    3: '중위험',
    4: '저위험',
    5: '초저위험',
  };

  if (riskGrade >= 4) {
    reasons.push(
      `${riskGradeLabels[riskGrade as keyof typeof riskGradeLabels]} 등급으로 안정성이 높습니다`
    );
  }

  // 투자 성향별 맞춤 이유
  if (investType === 'CONSERVATIVE' && riskGrade >= 4) {
    reasons.push('낮은 위험등급으로 안정적 투자에 적합합니다');
  }

  if (investType === 'AGGRESSIVE' && metrics.sharpeRatio > 0.8) {
    reasons.push('높은 위험 대비 수익률로 공격적 투자에 적합합니다');
  }

  return reasons;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }

    const userId = params.userId;

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryFilter = searchParams.get('category')?.split(',') || [];
    const riskPreference =
      (searchParams.get('risk') as InvestType) || 'NEUTRAL';

    const userProfile = await prisma.investmentProfile.findUnique({
      where: { userId: BigInt(userId) },
      select: { investType: true },
    });

    const investType = userProfile?.investType || riskPreference;

    const etfs = await prisma.etf.findMany({
      where: {
        return1y: { not: null },
        etfTotalFee: { not: null },
        netAssetTotalAmount: { not: null },
        traceErrRate: { not: null },
        divergenceRate: { not: null },
        volatility: { not: null },
        ...(categoryFilter.length > 0 && {
          category: {
            fullPath: { in: categoryFilter },
          },
        }),
      },
      include: {
        category: {
          select: { fullPath: true },
        },
        // 최신 거래 데이터 (최근 30일 평균)
        tradings: {
          where: {
            baseDate: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: {
            accTotalValue: true,
          },
        },
      },
      take: 100,
    });

    if (etfs.length === 0) {
      return NextResponse.json(
        { message: '추천할 수 있는 ETF가 없습니다.' },
        { status: 404 }
      );
    }

    // 지표별 최대/최소값 계산
    const metrics = {
      return1y: {
        min: Math.min(...etfs.map((e) => Number(e.return1y) || 0)),
        max: Math.max(...etfs.map((e) => Number(e.return1y) || 0)),
      },
      etfTotalFee: {
        min: Math.min(...etfs.map((e) => Number(e.etfTotalFee) || 0)),
        max: Math.max(...etfs.map((e) => Number(e.etfTotalFee) || 0)),
      },
      netAssetTotalAmount: {
        min: Math.min(...etfs.map((e) => Number(e.netAssetTotalAmount) || 0)),
        max: Math.max(...etfs.map((e) => Number(e.netAssetTotalAmount) || 0)),
      },
      traceErrRate: {
        min: Math.min(...etfs.map((e) => Number(e.traceErrRate) || 0)),
        max: Math.max(...etfs.map((e) => Number(e.traceErrRate) || 0)),
      },
      divergenceRate: {
        min: Math.min(
          ...etfs.map((e) => Math.abs(Number(e.divergenceRate) || 0))
        ),
        max: Math.max(
          ...etfs.map((e) => Math.abs(Number(e.divergenceRate) || 0))
        ),
      },
      volatility: {
        min: Math.min(...etfs.map((e) => Number(e.volatility) || 0)),
        max: Math.max(...etfs.map((e) => Number(e.volatility) || 0)),
      },
    };

    // 거래대금 최대/최소값 계산
    const allTradingValues = etfs
      .flatMap((etf) => etf.tradings.map((t) => Number(t.accTotalValue) || 0))
      .filter((v) => v > 0);

    const tradingVolume = {
      min: allTradingValues.length > 0 ? Math.min(...allTradingValues) : 0,
      max: allTradingValues.length > 0 ? Math.max(...allTradingValues) : 0,
    };

    const weights = getRiskBasedWeights(investType);

    // 각 ETF에 대한 종합 점수 계산
    const scoredEtfs: EtfRecommendationResponse[] = etfs.map((etf) => {
      const volatility = Number(etf.volatility) || 0;
      const riskGrade = classifyRiskGrade(volatility);

      // 샤프비율 계산 (하나증권 기준 적용)
      const sharpeRatio = calculateSharpeRatio(
        Number(etf.return1y) || 0,
        volatility
      );

      // 평균 거래대금 계산
      const avgTradingVolume =
        etf.tradings.length > 0
          ? etf.tradings.reduce(
              (sum, t) => sum + Number(t.accTotalValue) || 0,
              0
            ) / etf.tradings.length
          : 0;

      // 위험등급별 정규화된 변동성
      const normalizedVolatility = normalizeVolatilityByRiskGrade(volatility);

      // 각 지표 정규화 (0-1 범위)
      const normalizedMetrics = {
        sharpeRatio: normalize(sharpeRatio, -2, 2), // 샤프비율은 보통 -2~2 범위
        totalFee:
          1 -
          normalize(
            Number(etf.etfTotalFee) || 0,
            metrics.etfTotalFee.min,
            metrics.etfTotalFee.max
          ), // 수수료는 낮을수록 좋음
        tradingVolume: normalize(
          avgTradingVolume,
          tradingVolume.min,
          tradingVolume.max
        ),
        netAssetValue: normalize(
          Number(etf.netAssetTotalAmount) || 0,
          metrics.netAssetTotalAmount.min,
          metrics.netAssetTotalAmount.max
        ),
        trackingError:
          1 -
          normalize(
            Number(etf.traceErrRate) || 0,
            metrics.traceErrRate.min,
            metrics.traceErrRate.max
          ), // 추적오차는 낮을수록 좋음
        divergenceRate:
          1 -
          normalize(
            Math.abs(Number(etf.divergenceRate) || 0),
            metrics.divergenceRate.min,
            metrics.divergenceRate.max
          ), // 괴리율은 낮을수록 좋음
        volatility: normalizedVolatility, // 위험등급 기반 정규화된 변동성 사용
      };

      // 가중 평균 점수 계산
      const score =
        normalizedMetrics.sharpeRatio * weights.sharpeRatio +
        normalizedMetrics.totalFee * weights.totalFee +
        normalizedMetrics.tradingVolume * weights.tradingVolume +
        normalizedMetrics.netAssetValue * weights.netAssetValue +
        normalizedMetrics.trackingError * weights.trackingError +
        normalizedMetrics.divergenceRate * weights.divergenceRate +
        normalizedMetrics.volatility * weights.volatility;

      return {
        etfId: etf.id.toString(),
        issueCode: etf.issueCode || '',
        issueName: etf.issueName || '',
        category: etf.category.fullPath,
        score: Math.round(score * 100) / 100,
        riskGrade: riskGrade, // 하나증권 위험등급 추가
        metrics: {
          sharpeRatio: Math.round(sharpeRatio * 100) / 100,
          totalFee: Number(etf.etfTotalFee) || 0,
          tradingVolume: avgTradingVolume,
          netAssetValue: Number(etf.netAssetTotalAmount) || 0,
          trackingError: Number(etf.traceErrRate) || 0,
          divergenceRate: Number(etf.divergenceRate) || 0,
          volatility: volatility,
          normalizedVolatility: normalizedVolatility,
        },
        reasons: generateReasons(
          etf,
          {
            sharpeRatio,
            totalFee: Number(etf.etfTotalFee) || 0,
            tradingVolume: avgTradingVolume,
            netAssetValue: Number(etf.netAssetTotalAmount) || 0,
            trackingError: Number(etf.traceErrRate) || 0,
            divergenceRate: Number(etf.divergenceRate) || 0,
            volatility: volatility,
          },
          investType
        ),
      };
    });

    // 점수 기준으로 정렬하고 상위 결과 반환
    const recommendations = scoredEtfs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return NextResponse.json({
      message: 'ETF 추천 성공',
      data: {
        recommendations,
        userProfile: {
          investType,
          totalEtfsAnalyzed: etfs.length,
        },
        weights,
      },
    });
  } catch (error) {
    console.error('ETF 추천 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
