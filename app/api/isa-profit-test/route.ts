// 예: app/api/testMonthly/route.ts
import { NextResponse } from 'next/server';
import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';

export async function GET() {
  try {
    console.log('=== ISA 수익률 테스트 시작 ===');

    const result = await getMonthlyReturns('2025-06-30');

    console.log('=== 테스트 결과 ===');
    console.log('월별 수익률:', result.returns);
    console.log('월별 평가금액:', result.monthlyEvaluatedAmounts);
    console.log('현재 평가금액:', result.evaluatedAmount);
    console.log('평가 수익:', result.evaluatedProfit);

    // 검증 로직
    const monthlyAmounts = result.monthlyEvaluatedAmounts;
    console.log('\n=== 월별 평가금액 검증 ===');

    monthlyAmounts.forEach((monthData, index) => {
      const [date, amount] = Object.entries(monthData)[0];
      console.log(`${date}: ${amount.toLocaleString()}원`);

      // 이전 월과 비교
      if (index > 0) {
        const prevMonthData = monthlyAmounts[index - 1];
        const [prevDate, prevAmount] = Object.entries(prevMonthData)[0];
        const change = amount - prevAmount;
        const changePercent = ((change / prevAmount) * 100).toFixed(2);
        console.log(
          `  → ${prevDate} 대비: ${change >= 0 ? '+' : ''}${change.toLocaleString()}원 (${changePercent}%)`
        );
      }
    });

    return NextResponse.json({
      success: true,
      result,
      message: 'ISA 수익률 테스트 완료',
    });
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
