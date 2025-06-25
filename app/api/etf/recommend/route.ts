// 샤프비율 -> etf.수익률 - 0.03 / etf.변동성
// 총보수 -> etf.etf_total_fee
// 거래대금 -> etf_daily_trading.acc_total_value
// 순자산총액 -> etf.net_asset_total_amount
// 추적오차 -> etf.trace_err_rate
// 괴리율 -> etf.divergence_rate
// 변동성 -> etf.volatility

// 사용자 성향에 따라서 추천 가능한 상품 필터링 되어야함
// 추천에 대한 화면 구성

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { EtfTestService } from '@/services/etf/etf-test-service';
import { InvestType } from '@prisma/client';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

interface EtfRecommendationResponse {
  etfId: string;
  issueCode: string;
  issueName: string;
  category: string;
  score: number;
  riskGrade: number; // 하나증권 위험등급 추가
  flucRate: number; // 변동률 추가
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
  reasons: {
    title: string;
    description: string;
  }[];
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
function calculateSharpeRatio(
  return1y: number,
  volatility: number,
  riskGrade: number
): number {
  if (!volatility || volatility === 0) return 0;

  const riskFreeRate = 0.03; // 3% 무위험 수익률

  // 위험등급별 대표 변동성 수치 사용
  const representativeVolatility = getRepresentativeVolatility(riskGrade);

  // 샤프비율 계산 (대표 변동성 사용)
  return (return1y - riskFreeRate) / representativeVolatility;
}

// 투자 성향별 가중치 설정
function getRiskBasedWeights(investType: InvestType) {
  const weights = {
    CONSERVATIVE: {
      sharpeRatio: 0.05,
      totalFee: 0.35,
      tradingVolume: 0.1,
      netAssetValue: 0.25,
      trackingError: 0.1,
      divergenceRate: 0.05,
      volatility: 0.1,
    },
    MODERATE: {
      sharpeRatio: 0.1,
      totalFee: 0.25,
      tradingVolume: 0.15,
      netAssetValue: 0.2,
      trackingError: 0.1,
      divergenceRate: 0.1,
      volatility: 0.1,
    },
    NEUTRAL: {
      sharpeRatio: 0.15,
      totalFee: 0.2,
      tradingVolume: 0.15,
      netAssetValue: 0.15,
      trackingError: 0.1,
      divergenceRate: 0.1,
      volatility: 0.15,
    },
    ACTIVE: {
      sharpeRatio: 0.2,
      totalFee: 0.15,
      tradingVolume: 0.2,
      netAssetValue: 0.1,
      trackingError: 0.1,
      divergenceRate: 0.15,
      volatility: 0.1,
    },
    AGGRESSIVE: {
      sharpeRatio: 0.25,
      totalFee: 0.1,
      tradingVolume: 0.25,
      netAssetValue: 0.05,
      trackingError: 0.1,
      divergenceRate: 0.15,
      volatility: 0.1,
    },
  };

  return weights[investType] || weights.NEUTRAL;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

// 위험등급별 정규화된 변동성 계산
function normalizeVolatilityByRiskGrade(riskGrade: number): number {
  // 위험등급별 정규화 (1등급=0.0, 5등급=1.0)
  // 안전한 ETF일수록 높은 점수
  return (6 - riskGrade) / 5;
}

// 추천 이유 생성 함수
function generateReasons(
  etf: any,
  metrics: any,
  investType: InvestType,
  riskGrade: number
): { title: string; description: string }[] {
  const reasons: { title: string; description: string }[] = [];

  // 샤프비율 기반 이유
  if (metrics.sharpeRatio > 1.0) {
    reasons.push({
      title: '우수한 샤프비율',
      description:
        '샤프비율이 1.0을 초과하여, 동일한 위험 수준에서 더 높은 수익을 기대할 수 있는 상품입니다. 위험 대비 성과가 우수하여 안정성과 수익성을 함께 고려하는 투자자에게 적합합니다.',
    });
  }

  // 총보수 기반 이유
  if (metrics.totalFee < 0.3) {
    reasons.push({
      title: '낮은 총보수',
      description:
        '총보수가 0.3% 미만으로 낮아, 장기 투자 시 비용 부담을 줄이고 실질 수익률을 높일 수 있습니다. 수수료에 민감한 투자자에게 유리한 선택입니다.',
    });
  }

  // 거래대금 기반 이유
  if (metrics.tradingVolume > 1000000000) {
    // 10억원 이상
    reasons.push({
      title: '높은 거래대금',
      description:
        '일일 평균 거래대금이 10억 원 이상으로, 시장 유동성이 뛰어나 매수·매도가 원활합니다. 단기 매매 전략을 고려하는 투자자에게 적합합니다.',
    });
  }

  // 순자산총액 기반 이유
  if (metrics.netAssetValue > 100000000000) {
    // 1000억원 이상
    reasons.push({
      title: '대형 ETF',
      description:
        '순자산총액이 1,000억 원 이상으로, 규모가 크고 운용 안정성이 높습니다. 대형 ETF로서 투자자 신뢰도가 높고, 자금 유입에 따른 안정적인 운용이 가능합니다.',
    });
  }

  // 추적오차 기반 이유
  if (metrics.trackingError < 0.5) {
    reasons.push({
      title: '정밀한 추적',
      description:
        '추적오차가 0.5% 미만으로, 기초지수를 정밀하게 따라가고 있습니다. 지수 수익률에 근접한 성과를 원하는 투자자에게 적합한 상품입니다.',
    });
  }

  // 괴리율 기반 이유
  if (Math.abs(metrics.divergenceRate) < 0.5) {
    reasons.push({
      title: '낮은 괴리율',
      description:
        '괴리율이 ±0.5% 이내로 낮아, 시장가격이 순자산가치(NAV)와 거의 일치합니다. 가격 왜곡 가능성이 낮아 합리적인 가격에 매수·매도할 수 있습니다.',
    });
  }

  // 위험등급 기반 이유 (하나증권 기준)
  const riskGradeLabels = {
    1: '초고위험',
    2: '고위험',
    3: '중위험',
    4: '저위험',
    5: '초저위험',
  };

  if (riskGrade >= 4) {
    reasons.push({
      title: `${riskGradeLabels[riskGrade as keyof typeof riskGradeLabels]} 등급`,
      description: `${riskGradeLabels[riskGrade as keyof typeof riskGradeLabels]} 등급(리스크 등급 ${riskGrade})으로, 가격 변동성이 낮고 안정적인 운용이 기대됩니다.`,
    });
  }

  // 투자 성향별 맞춤 이유
  if (investType === 'CONSERVATIVE' && riskGrade >= 4) {
    reasons.push({
      title: '보수적 투자 성향 부합',
      description:
        '고객님의 보수적인 투자 성향에 부합하는 낮은 위험등급 상품으로, 원금 손실 가능성을 최소화하면서 안정적인 수익을 추구할 수 있습니다.',
    });
  }

  if (investType === 'AGGRESSIVE' && metrics.sharpeRatio > 0.8) {
    reasons.push({
      title: '공격적 투자 성향 부합',
      description:
        '고객님의 공격적인 투자 성향에 맞게, 높은 샤프비율을 보이는 상품으로 위험을 감수하더라도 수익을 극대화하고자 하는 전략에 적합합니다.',
    });
  }

  return reasons;
}

// 투자 성향별 허용 위험등급 설정
function getAllowedRiskGrades(investType: InvestType): number[] {
  const allowedGrades = {
    CONSERVATIVE: [4, 5], // 저위험, 초저위험만 허용
    MODERATE: [3, 4, 5], // 중위험, 저위험, 초저위험 허용
    NEUTRAL: [2, 3, 4, 5], // 고위험, 중위험, 저위험, 초저위험 허용
    ACTIVE: [1, 2, 3, 4, 5], // 모든 위험등급 허용
    AGGRESSIVE: [1, 2, 3, 4, 5], // 모든 위험등급 허용
  };

  return allowedGrades[investType] || [3, 4, 5];
}

/**
 * 3년간의 ETF 일별 거래 데이터 가져오기 (fluc_rate 포함)
 */
const getEtfDailyTrading3y = async (etfId: number) => {
  const from = new Date();
  from.setFullYear(from.getFullYear() - 3); // 3년 전

  // fluc_rate와 함께 조회
  const rows = await prisma.etfDailyTrading.findMany({
    where: { etfId, baseDate: { gte: from } }, // etfId와 날짜 조건
    orderBy: { baseDate: 'asc' }, // 날짜 기준 정렬
    select: {
      baseDate: true,
      tddClosePrice: true,
      flucRate: true, // 추가된 필드
    },
  });

  // 데이터를 변환하여 반환
  return rows.map((r) => ({
    date: r.baseDate.toISOString().slice(0, 10), // 날짜 형식 변환
    closePrice: Number(r.tddClosePrice), // 종가
    flucRate: Number(r.flucRate), // 변동률
  }));
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }

    const userId = BigInt(session.user.id);
    const limit = 10;
    // const categoryFilter = searchParams.get('category')?.split(',') || [];

    // etf-test-service를 통해 사용자의 투자 성향 조회
    const etfTestService = new EtfTestService();
    const userInvestType = await etfTestService.getUserInvestType(
      BigInt(userId)
    );

    // 사용자의 투자 성향이 없으면 추천 진행하지 않음
    if (!userInvestType) {
      return NextResponse.json(
        { message: '투자 성향 테스트를 먼저 완료해주세요.' },
        { status: 400 }
      );
    }

    const investType = userInvestType;

    // ETF 데이터 조회 - 필수 지표가 모두 있는 ETF만 선택
    const etfs = await prisma.etf.findMany({
      where: {
        // 필수 지표가 모두 있는 ETF만 선택
        AND: [
          { return1y: { not: null } },
          { etfTotalFee: { not: null } },
          { netAssetTotalAmount: { not: null } },
          { traceErrRate: { not: null } },
          { divergenceRate: { not: null } },
          { volatility: { not: null } },
          { volatility: { not: '' } }, // 빈 문자열이 아닌 변동성만
          // 카테고리 필터 적용
          // ...(categoryFilter.length > 0
          //   ? [
          //       {
          //         category: {
          //           fullPath: { in: categoryFilter },
          //         },
          //       },
          //     ]
          //   : []),
        ],
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
            accTotalValue: { gt: 0 }, // 거래대금이 있는 데이터만
          },
          select: {
            accTotalValue: true,
            flucRate: true, // 변동률 추가
          },
          orderBy: {
            baseDate: 'desc',
          },
          take: 30, // 최근 30일 데이터만
        },
      },
      orderBy: {
        netAssetTotalAmount: 'desc', // 순자산총액 기준 내림차순
      },
      take: 400, // 더 많은 ETF를 가져와서 필터링 후 선택
    });

    console.log(
      `[ETF 데이터 조회] 총 ${etfs.length}개의 ETF 데이터를 조회했습니다.`
    );

    if (etfs.length === 0) {
      return NextResponse.json(
        { message: '추천할 수 있는 ETF가 없습니다.' },
        { status: 404 }
      );
    }

    // 거래대금이 있는 ETF만 필터링
    const etfsWithTradingData = etfs.filter((etf) => etf.tradings.length > 0);
    console.log(
      `[ETF 거래데이터 필터링] 거래대금 데이터가 있는 ETF: ${etfsWithTradingData.length}개`
    );

    if (etfsWithTradingData.length === 0) {
      return NextResponse.json(
        { message: '거래 데이터가 있는 ETF가 없습니다.' },
        { status: 404 }
      );
    }

    // ETF 데이터를 미리 변환하여 중복 계산 방지
    const processedEtfs = etfsWithTradingData.map((etf) => {
      const return1y = Number(etf.return1y) || 0;
      const etfTotalFee = Number(etf.etfTotalFee) || 0;
      const netAssetTotalAmount = Number(etf.netAssetTotalAmount) || 0;
      const traceErrRate = Number(etf.traceErrRate) || 0;
      const divergenceRate = Number(etf.divergenceRate) || 0;
      const volatility = Number(etf.volatility) || 0;
      const riskGrade = classifyRiskGrade(volatility);

      // 평균 거래대금 계산
      const avgTradingVolume =
        etf.tradings.length > 0
          ? etf.tradings.reduce(
              (sum: number, t) => sum + Number(t.accTotalValue) || 0,
              0
            ) / etf.tradings.length
          : 0;

      // 최신 변동률 계산 (가장 최근 거래 데이터의 flucRate)
      const latestFlucRate =
        etf.tradings.length > 0 ? Number(etf.tradings[0].flucRate) || 0 : 0;

      return {
        ...etf,
        processedData: {
          return1y,
          etfTotalFee,
          netAssetTotalAmount,
          traceErrRate,
          divergenceRate,
          volatility,
          riskGrade,
          avgTradingVolume,
          flucRate: latestFlucRate,
        },
      };
    });

    // 지표별 최대/최소값 계산 (거래대금이 있는 ETF만 대상)
    const metrics = {
      return1y: {
        min: Math.min(...processedEtfs.map((e) => e.processedData.return1y)),
        max: Math.max(...processedEtfs.map((e) => e.processedData.return1y)),
      },
      etfTotalFee: {
        min: Math.min(...processedEtfs.map((e) => e.processedData.etfTotalFee)),
        max: Math.max(...processedEtfs.map((e) => e.processedData.etfTotalFee)),
      },
      netAssetTotalAmount: {
        min: Math.min(
          ...processedEtfs.map((e) => e.processedData.netAssetTotalAmount)
        ),
        max: Math.max(
          ...processedEtfs.map((e) => e.processedData.netAssetTotalAmount)
        ),
      },
      traceErrRate: {
        min: Math.min(
          ...processedEtfs.map((e) => e.processedData.traceErrRate)
        ),
        max: Math.max(
          ...processedEtfs.map((e) => e.processedData.traceErrRate)
        ),
      },
      divergenceRate: {
        min: Math.min(
          ...processedEtfs.map((e) => Math.abs(e.processedData.divergenceRate))
        ),
        max: Math.max(
          ...processedEtfs.map((e) => Math.abs(e.processedData.divergenceRate))
        ),
      },
      volatility: {
        min: Math.min(...processedEtfs.map((e) => e.processedData.volatility)),
        max: Math.max(...processedEtfs.map((e) => e.processedData.volatility)),
      },
    };

    // 거래대금 최대/최소값 계산
    const allTradingValues = processedEtfs
      .map((etf) => etf.processedData.avgTradingVolume)
      .filter((v) => v > 0);

    const tradingVolume = {
      min: allTradingValues.length > 0 ? Math.min(...allTradingValues) : 0,
      max: allTradingValues.length > 0 ? Math.max(...allTradingValues) : 0,
    };

    const weights = getRiskBasedWeights(investType);
    const allowedRiskGrades = getAllowedRiskGrades(investType);

    // 각 ETF에 대한 종합 점수 계산
    const scoredEtfs = processedEtfs
      .map((etf) => {
        const { processedData } = etf;
        const {
          return1y,
          etfTotalFee,
          netAssetTotalAmount,
          traceErrRate,
          divergenceRate,
          volatility,
          riskGrade,
          avgTradingVolume,
          flucRate,
        } = processedData;

        // 투자 성향에 맞지 않는 위험등급은 제외
        if (!allowedRiskGrades.includes(riskGrade)) {
          console.log(
            `[ETF 추천 필터링] ${etf.issueName} (${etf.issueCode}) - 위험등급 ${riskGrade}는 ${investType} 투자성향에 허용되지 않음. 허용등급: ${allowedRiskGrades.join(', ')}`
          );
          return null; // 필터링을 위해 null 반환
        }

        // 샤프비율 계산 (하나증권 기준 적용)
        const sharpeRatio = calculateSharpeRatio(
          return1y,
          volatility,
          riskGrade
        );

        // 위험등급별 정규화된 변동성
        const normalizedVolatility = normalizeVolatilityByRiskGrade(riskGrade);

        // 각 지표 정규화 (0-1 범위)
        const normalizedMetrics = {
          sharpeRatio: normalize(sharpeRatio, -2, 2), // 샤프비율은 보통 -2~2 범위
          totalFee:
            1 -
            normalize(
              etfTotalFee,
              metrics.etfTotalFee.min,
              metrics.etfTotalFee.max
            ), // 수수료는 낮을수록 좋음
          tradingVolume: normalize(
            avgTradingVolume,
            tradingVolume.min,
            tradingVolume.max
          ),
          netAssetValue: normalize(
            netAssetTotalAmount,
            metrics.netAssetTotalAmount.min,
            metrics.netAssetTotalAmount.max
          ),
          trackingError:
            1 -
            normalize(
              traceErrRate,
              metrics.traceErrRate.min,
              metrics.traceErrRate.max
            ), // 추적오차는 낮을수록 좋음
          divergenceRate:
            1 -
            normalize(
              Math.abs(divergenceRate),
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

        // console.log(`[ETF 추천 점수] ${etf.issueName} (${etf.issueCode}) - 위험등급: ${riskGrade}, 점수: ${Math.round(score * 100) / 100}, 샤프비율: ${Math.round(sharpeRatio * 100) / 100}`);

        return {
          etfId: etf.id.toString(),
          issueCode: etf.issueCode || '',
          issueName: etf.issueName || '',
          category: etf.category.fullPath,
          score: Math.round(score * 100) / 100,
          riskGrade: riskGrade, // 하나증권 위험등급 추가
          flucRate: flucRate, // 변동률 추가
          metrics: {
            sharpeRatio: Math.round(sharpeRatio * 100) / 100,
            totalFee: etfTotalFee,
            tradingVolume: avgTradingVolume,
            netAssetValue: netAssetTotalAmount,
            trackingError: traceErrRate,
            divergenceRate: divergenceRate,
            volatility: volatility,
            normalizedVolatility: normalizedVolatility,
          },
          reasons: generateReasons(
            etf,
            {
              sharpeRatio,
              totalFee: etfTotalFee,
              tradingVolume: avgTradingVolume,
              netAssetValue: netAssetTotalAmount,
              trackingError: traceErrRate,
              divergenceRate: divergenceRate,
              volatility: volatility,
            },
            investType,
            riskGrade
          ),
        };
      })
      .filter((etf): etf is EtfRecommendationResponse => etf !== null); // null 값 필터링

    // 점수 기준으로 정렬하고 상위 결과 반환
    const recommendations = scoredEtfs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(
      `[ETF 추천 결과] 사용자 투자성향: ${investType}, 분석된 ETF 수: ${processedEtfs.length}, 필터링 후 ETF 수: ${scoredEtfs.length}, 최종 추천 수: ${recommendations.length}`
    );
    console.log(
      `[ETF 추천 상위 10개] ${recommendations
        .slice(0, 10)
        .map(
          (r) => `${r.issueName} (위험등급: ${r.riskGrade}, 점수: ${r.score})`
        )
        .join(', ')}`
    );

    return NextResponse.json({
      message: 'ETF 추천 성공',
      data: {
        recommendations,
        userProfile: {
          investType,
          totalEtfsAnalyzed: processedEtfs.length,
          filteredEtfsCount: scoredEtfs.length,
        },
        weights,
        debug: {
          allowedRiskGrades,
          totalEtfsBeforeFilter: processedEtfs.length,
          totalEtfsAfterFilter: scoredEtfs.length,
        },
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
