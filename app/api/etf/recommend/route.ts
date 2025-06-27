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
import { EtfRecommendationService } from '@/services/etf/etf-recommendation-service';
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

    const etfRecommendationService = new EtfRecommendationService();
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

    if (error instanceof Error) {
      // 투자 성향 테스트 미완료
      if (error.message.includes('투자 성향 테스트를 먼저 완료해주세요')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }

      // ETF 데이터 없음
      if (error.message.includes('추천할 수 있는 ETF가 없습니다')) {
        return NextResponse.json({ message: error.message }, { status: 404 });
      }

      // 거래 데이터 없음
      if (error.message.includes('거래 데이터가 있는 ETF가 없습니다')) {
        return NextResponse.json({ message: error.message }, { status: 404 });
      }

      // 기타 알려진 에러들
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
