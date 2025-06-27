import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma, SnapshotType } from '@prisma/client';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

// 안전한 숫자 변환 유틸리티 함수
function safeNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// BigInt를 문자열로 변환하는 함수
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToString(value);
    }
    return converted;
  }

  return obj;
}

enum InvestType {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  NEUTRAL = 'NEUTRAL',
  ACTIVE = 'ACTIVE',
  AGGRESSIVE = 'AGGRESSIVE',
}

type UserHoldingDetails = {
  etfId?: bigint;
  name: string;
  totalCost: number;
  currentValue: number;
  profitOrLoss: number;
  returnRate: number;
  categoryPath: string;
  assetType: 'ETF' | 'BOND' | 'FUND' | 'ELS' | 'CASH';
};

const RECOMMENDED_PORTFOLIOS: Record<
  InvestType,
  { category: string; percentage: number }[]
> = {
  [InvestType.CONSERVATIVE]: [
    { category: '국내 주식', percentage: 10 },
    { category: '해외 주식', percentage: 10 },
    { category: '채권', percentage: 60 },
    { category: 'ELS', percentage: 5 },
    { category: '펀드', percentage: 15 },
  ],
  [InvestType.MODERATE]: [
    { category: '국내 주식', percentage: 25 },
    { category: '해외 주식', percentage: 25 },
    { category: '채권', percentage: 40 },
    { category: 'ELS', percentage: 5 },
    { category: '펀드', percentage: 5 },
  ],
  [InvestType.NEUTRAL]: [
    { category: '국내 주식', percentage: 30 },
    { category: '해외 주식', percentage: 30 },
    { category: '채권', percentage: 30 },
    { category: 'ELS', percentage: 5 },
    { category: '펀드', percentage: 5 },
  ],
  [InvestType.ACTIVE]: [
    { category: '국내 주식', percentage: 35 },
    { category: '해외 주식', percentage: 35 },
    { category: '채권', percentage: 20 },
    { category: 'ELS', percentage: 5 },
    { category: '펀드', percentage: 5 },
  ],
  [InvestType.AGGRESSIVE]: [
    { category: '국내 주식', percentage: 40 },
    { category: '해외 주식', percentage: 40 },
    { category: '채권', percentage: 10 },
    { category: 'ELS', percentage: 5 },
    { category: '펀드', percentage: 5 },
  ],
};

type UserPortfolio = {
  category: string;
  percentage: number;
  totalValue: number;
  profitOrLoss: number;
  returnRate: number;
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: '인증되지 않은 사용자입니다.' },
      { status: 401 }
    );
  }

  const userId = BigInt(session.user.id);

  try {
    const investmentProfile = await prisma.investmentProfile.findUnique({
      where: { userId },
    });

    if (!investmentProfile) {
      return NextResponse.json(
        { message: '투자 성향 정보가 없습니다.' },
        { status: 404 }
      );
    }

    // 현재 월의 스냅샷 데이터 조회
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [year, month] = yearMonth.split('-').map(Number);
    const snapshotDate = new Date(Date.UTC(year, month, 0));

    const isaAccount = await prisma.iSAAccount.findUnique({
      where: { userId },
      select: {
        generalHoldingSnapshots: {
          where: {
            snapshotDate: {
              gte: snapshotDate,
              lt: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          select: {
            evaluatedAmount: true,
            snapshotType: true,
          },
        },
        generalHoldings: {
          select: {
            totalCost: true,
            product: {
              select: {
                instrumentType: true,
                productName: true,
              },
            },
          },
        },
        etfHoldingSnapshots: {
          where: {
            snapshotDate: {
              gte: snapshotDate,
              lt: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          select: {
            evaluatedAmount: true,
            etf: {
              select: {
                id: true,
                issueNameKo: true,
                idxMarketType: true,
              },
            },
          },
        },
        etfHoldings: {
          include: {
            etf: {
              include: {
                tradings: {
                  orderBy: { baseDate: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!isaAccount) {
      return NextResponse.json(
        { message: 'ISA 계좌 정보가 없습니다.' },
        { status: 404 }
      );
    }

    const portfolioByCategory: Record<string, { value: number; cost: number }> =
      {};
    let totalValue = 0;
    const userHoldings: UserHoldingDetails[] = [];

    // 일반 자산 집계 (스냅샷 데이터 우선, 없으면 현재 보유 데이터 사용)
    let bond = 0,
      fund = 0,
      els = 0;

    for (const holding of isaAccount.generalHoldings) {
      const currentValue = safeNumber(holding.totalCost);

      if (holding.product?.instrumentType === 'BOND') {
        bond += currentValue;
        userHoldings.push({
          name: holding.product.productName || '채권',
          totalCost: currentValue,
          currentValue: currentValue,
          profitOrLoss: 0,
          returnRate: 0,
          categoryPath: '채권',
          assetType: 'BOND',
        });
      } else if (holding.product?.instrumentType === 'FUND') {
        fund += currentValue;
        userHoldings.push({
          name: holding.product.productName || '펀드',
          totalCost: currentValue,
          currentValue: currentValue,
          profitOrLoss: 0,
          returnRate: 0,
          categoryPath: '펀드',
          assetType: 'FUND',
        });
      } else {
        els += currentValue;
        userHoldings.push({
          name: holding.product.productName || 'ELS',
          totalCost: currentValue,
          currentValue: currentValue,
          profitOrLoss: 0,
          returnRate: 0,
          categoryPath: 'ELS',
          assetType: 'ELS',
        });
      }
    }

    // ETF 자산 집계 (스냅샷 데이터 우선, 없으면 현재 보유 데이터 사용)
    let etfDomestic = 0,
      etfForeign = 0,
      etfBoth = 0;

    if (isaAccount.etfHoldingSnapshots.length > 0) {
      // 스냅샷 데이터 사용
      for (const snapshot of isaAccount.etfHoldingSnapshots) {
        const currentValue = safeNumber(snapshot.evaluatedAmount);
        const type = snapshot.etf.idxMarketType;

        if (type === '국내') {
          etfDomestic += currentValue;
          userHoldings.push({
            etfId: snapshot.etf.id,
            name: snapshot.etf.issueNameKo || 'ETF',
            totalCost: currentValue,
            currentValue: currentValue,
            profitOrLoss: 0,
            returnRate: 0,
            categoryPath: '국내 주식',
            assetType: 'ETF',
          });
        } else if (type === '해외') {
          etfForeign += currentValue;
          userHoldings.push({
            etfId: snapshot.etf.id,
            name: snapshot.etf.issueNameKo || 'ETF',
            totalCost: currentValue,
            currentValue: currentValue,
            profitOrLoss: 0,
            returnRate: 0,
            categoryPath: '해외 주식',
            assetType: 'ETF',
          });
        } else if (type === '국내&해외') {
          etfBoth += currentValue;
          userHoldings.push({
            etfId: snapshot.etf.id,
            name: snapshot.etf.issueNameKo || 'ETF',
            totalCost: currentValue,
            currentValue: currentValue,
            profitOrLoss: 0,
            returnRate: 0,
            categoryPath: '국내&해외 주식',
            assetType: 'ETF',
          });
        }
      }
    } else {
      // 스냅샷 데이터가 없으면 현재 보유 데이터 사용 (기존 로직)
      for (const holding of isaAccount.etfHoldings) {
        try {
          const latestTrading = holding.etf.tradings?.[0];
          const currentPrice =
            latestTrading?.tddClosePrice ?? new Prisma.Decimal(0);
          const currentValue = holding.quantity.mul(currentPrice).toNumber();
          const totalHoldingCost = holding.quantity
            .mul(holding.avgCost)
            .toNumber();
          const profitOrLoss = currentValue - totalHoldingCost;

          const type = holding.etf.idxMarketType;
          let categoryPath = '';
          if (type === '국내') {
            etfDomestic += currentValue;
            categoryPath = '국내 주식';
          } else if (type === '해외') {
            etfForeign += currentValue;
            categoryPath = '해외 주식';
          } else if (type === '국내&해외') {
            etfBoth += currentValue;
            categoryPath = '국내&해외 주식';
          }

          userHoldings.push({
            etfId: holding.etfId,
            name: holding.etf.issueNameKo || 'ETF',
            totalCost: totalHoldingCost,
            currentValue: currentValue,
            profitOrLoss,
            returnRate:
              totalHoldingCost > 0
                ? (profitOrLoss / totalHoldingCost) * 100
                : 0,
            categoryPath,
            assetType: 'ETF',
          });
        } catch (error) {
          console.error('ETF 보유 정보 처리 중 오류:', error, holding);
          continue;
        }
      }
    }

    // 포트폴리오 카테고리별 집계
    if (bond > 0) {
      portfolioByCategory['채권'] = { value: bond, cost: bond };
      totalValue += bond;
    }
    if (fund > 0) {
      portfolioByCategory['펀드'] = { value: fund, cost: fund };
      totalValue += fund;
    }
    if (els > 0) {
      portfolioByCategory['ELS'] = { value: els, cost: els };
      totalValue += els;
    }
    if (etfDomestic > 0) {
      portfolioByCategory['국내 주식'] = {
        value: etfDomestic,
        cost: etfDomestic,
      };
      totalValue += etfDomestic;
    }
    if (etfForeign > 0) {
      portfolioByCategory['해외 주식'] = {
        value: etfForeign,
        cost: etfForeign,
      };
      totalValue += etfForeign;
    }
    if (etfBoth > 0) {
      portfolioByCategory['국내&해외 주식'] = { value: etfBoth, cost: etfBoth };
      totalValue += etfBoth;
    }

    if (totalValue === 0) {
      const emptyResponse = {
        recommendedPortfolio:
          RECOMMENDED_PORTFOLIOS[investmentProfile.investType as InvestType],
        score: 0,
        rebalancingOpinions: [],
      };

      return NextResponse.json(convertBigIntToString(emptyResponse), {
        status: 200,
      });
    }

    const userPortfolio: UserPortfolio[] = Object.entries(
      portfolioByCategory
    ).map(([category, data]) => {
      const categoryProfitOrLoss = data.value - data.cost;
      return {
        category,
        percentage:
          totalValue > 0
            ? Number(((data.value / totalValue) * 100).toFixed(1))
            : 0,
        totalValue: data.value,
        profitOrLoss: categoryProfitOrLoss,
        returnRate:
          data.cost > 0 ? (categoryProfitOrLoss / data.cost) * 100 : 0,
      };
    });

    const recommendedPortfolio =
      RECOMMENDED_PORTFOLIOS[investmentProfile.investType as InvestType];
    const score = calculateScore(userPortfolio, recommendedPortfolio);
    const rebalancingOpinions = generateRebalancingOpinions(
      userPortfolio,
      recommendedPortfolio,
      userHoldings
    );

    const response = {
      recommendedPortfolio,
      score,
      rebalancingOpinions,
    };

    return NextResponse.json(convertBigIntToString(response));
  } catch (error) {
    console.error('리밸런싱 추천 조회 오류:', error);

    // 더 구체적인 에러 정보 로깅
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
    }

    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

function mapCategory(categoryPath: string): string | null {
  if (categoryPath === '국내 주식') return '국내 주식';
  if (categoryPath === '해외 주식') return '해외 주식';
  if (categoryPath === '국내&해외 주식') return '국내 주식';
  if (categoryPath === '채권') return '채권';
  if (categoryPath === 'ELS') return 'ELS';
  if (categoryPath === '펀드') return '펀드';
  if (categoryPath === '현금') return '현금';
  return null;
}

function calculateScore(
  userPortfolio: UserPortfolio[],
  recommendedPortfolio: { category: string; percentage: number }[]
): number {
  let score = 0;
  const userMap = new Map(userPortfolio.map((p) => [p.category, p.percentage]));

  for (const recommended of recommendedPortfolio) {
    const userPercentage = userMap.get(recommended.category) || 0;
    score += Math.abs(userPercentage - recommended.percentage);
  }

  return Math.max(0, 100 - score / 2);
}

function generateRebalancingOpinions(
  userPortfolio: UserPortfolio[],
  recommendedPortfolio: { category: string; percentage: number }[],
  userHoldings: UserHoldingDetails[]
) {
  const opinions: {
    category: string;
    userPercentage: number;
    recommendedPercentage: number;
    opinion: string;
    detail: string;
  }[] = [];
  const userMap = new Map(userPortfolio.map((p) => [p.category, p.percentage]));

  for (const recommended of recommendedPortfolio) {
    const userPercentage = userMap.get(recommended.category) || 0;
    const diff = userPercentage - recommended.percentage;
    const threshold = 5;

    let opinion = '적정 비중';
    let detail = `${recommended.category}의 현재 비중(${userPercentage.toFixed(1)}%)은 권장 비중(${recommended.percentage}%)에 부합합니다.`;

    if (diff > threshold) {
      opinion = '비중 축소 필요';
      const holdingsInCategory = userHoldings
        .filter((h) => mapCategory(h.categoryPath) === recommended.category)
        .sort((a, b) => a.returnRate - b.returnRate);

      const lowProfitHoldings = holdingsInCategory
        .filter((h) => h.returnRate < 0)
        .slice(0, 2);

      if (lowProfitHoldings.length > 0) {
        detail = `${recommended.category} 비중이 권장수준보다 ${diff.toFixed(1)}%p 높습니다. 특히 수익률이 낮은 ${lowProfitHoldings.map((h) => `'${h.name}'`).join(', ')}의 비중 조절을 우선적으로 고려해보세요.`;
      } else {
        detail = `${recommended.category} 비중이 권장수준보다 ${diff.toFixed(1)}%p 높습니다.`;
      }
    } else if (diff < -threshold) {
      opinion = '비중 확대 필요';
      detail = `${recommended.category} 비중이 권장수준보다 ${Math.abs(diff).toFixed(1)}%p 낮습니다. 해당 자산군에 대한 투자를 늘리는 것을 추천합니다.`;
    }

    opinions.push({
      category: recommended.category,
      userPercentage: parseFloat(userPercentage.toFixed(2)),
      recommendedPercentage: recommended.percentage,
      opinion,
      detail,
    });
  }

  return opinions;
}
