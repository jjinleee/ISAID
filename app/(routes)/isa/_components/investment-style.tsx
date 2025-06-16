import {
  ArrowRight,
  BarChart4,
  Bot,
  CircleDollarSign,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const InvestmentStyle = () => {
  return (
    <div className='mt-6 rounded-xl bg-white px-5 py-5 shadow-sm'>
      {/* 헤더 */}
      <div className='flex items-center gap-2 mb-3'>
        <ShieldCheck className='text-hana-green w-5 h-5' />
        <h2 className='font-semibold text-base'>투자 스타일 분석</h2>
      </div>

      {/* 종합 피드백 영역 */}
      <div className='space-y-4 text-sm text-gray-700 leading-snug'>
        {/* 포트폴리오 기반 */}
        <p>
          💡 <span className='font-bold text-hana-green'>안정형 투자자</span>에
          가까워요.
        </p>
        <p>
          전체 자산 중 <span className='font-semibold text-teal-600'>55%</span>
          가 안정적인 자산군 (채권, 현금 등)에 투자되어 있어요.
        </p>

        {/* 수익률 기반 */}
        <p>
          📉 최근 3개월 평균 수익률은{' '}
          <span className='font-semibold text-red-500'>+1.4%</span>로 동일 성향
          투자자 평균보다 낮아요.
        </p>

        {/* 거래 기록 기반 */}
        <p>
          🔄 <span className='font-semibold'>보유 종목 수가 2개 이하</span>로,
          분산 투자 효과가 적은 편이에요.
        </p>
        <p>
          💸 최근 5건의 거래 중 3건은{' '}
          <span className='font-semibold text-gray-600'>손실 매도</span>로
          마무리됐어요.
        </p>

        {/* 제안 */}
        <p>
          🎯 수익률 개선을 원한다면{' '}
          <span className='font-semibold'>ETF / 해외 주식</span> 비중을
          확대하거나,
          <span className='font-semibold'> 분기별 리밸런싱</span>을
          고려해보세요.
        </p>
      </div>

      {/* 출처 / 자동 판단 */}
      <div className='mt-4 text-xs text-gray-400 flex items-center gap-2'>
        <BarChart4 className='w-4 h-4' />이 분석은 자산 구성 및 최근 거래
        데이터를 기준으로 판단된 결과예요.
      </div>

      {/* 하나은행 ISA CTA 영역 */}
      <div className='mt-6 p-4 bg-hana-green/10 rounded-lg flex items-center justify-between'>
        <div className='flex items-start gap-2'>
          <Sparkles className='text-hana-green w-5 h-5 mt-0.5' />
          <div>
            <p className='font-medium text-gray-800 mb-1'>
              전문가 모델 기반 리밸런싱을 원하시나요?
            </p>
            <div className='flex items-center gap-1 text-xs text-gray-500'>
              <Bot className='w-3.5 h-3.5 text-gray-400' />
              하나은행 AI 기반 ISA 포트폴리오 추천과 연동해보세요.
            </div>
          </div>
        </div>
        <button className='flex items-center gap-1 text-sm text-hana-green font-semibold hover:underline whitespace-nowrap'>
          ISA 포트폴리오 연결하기
          <ArrowRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default InvestmentStyle;
