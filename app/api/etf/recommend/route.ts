// 샤프비율 -> etf.수익률 - 0.03 / etf.변동성
// 총보수 -> etf.etf_total_fee
// 거래대금 -> etf_daily_trading.acc_total_value
// 순자산총액 -> etf.net_asset_total_amount
// 추적오차 -> etf.trace_err_rate
// 괴리율 -> etf.divergence_rate
// 변동성 -> etf.volatility

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  EtfRecommendService,
  InvestmentProfileNotFoundError,
  NoEtfDataError,
  NoTradingDataError,
} from '@/services/etf/etf-recommend-service';
import { authOptions } from '@/lib/auth-options';

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

    console.log(`[ETF 추천] 사용자 ${userId}의 ETF 추천 요청 시작`);

    const etfRecommendationService = new EtfRecommendService();
    const result = await etfRecommendationService.getRecommendations(
      userId,
      limit
    );

    console.log(
      `[ETF 추천] 사용자 ${userId}의 ETF 추천 완료. 추천 개수: ${result.recommendations.length}`
    );

    return NextResponse.json({
      message: 'ETF 추천 성공',
      data: result,
    });
  } catch (error) {
    console.error('ETF 추천 오류:', error);

    // 커스텀 에러 클래스들을 사용한 에러 처리
    if (error instanceof InvestmentProfileNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof NoEtfDataError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof NoTradingDataError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    // 기타 알려진 에러들
    if (error instanceof Error) {
      if (
        error.message.includes('Database connection failed') ||
        error.message.includes('Service error') ||
        error.message.includes('Prisma')
      ) {
        console.error(
          '[ETF 추천] 데이터베이스 또는 서비스 오류:',
          error.message
        );
        return NextResponse.json(
          { message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 }
        );
      }
    }

    // 알 수 없는 에러
    console.error('[ETF 추천] 알 수 없는 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
