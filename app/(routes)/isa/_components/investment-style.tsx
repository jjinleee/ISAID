import { BarChart4, ShieldCheck, TrendingUp } from 'lucide-react';

const InvestmentStyle = () => {
  return (
    <div className='mt-6 rounded-xl bg-white px-5 py-5 shadow-sm'>
      <div className='flex items-center gap-2 mb-3'>
        <ShieldCheck className='text-hana-green w-5 h-5' />
        <h2 className='font-semibold text-base'>투자 스타일 분석</h2>
      </div>

      <div className='space-y-3 text-sm text-gray-700 leading-snug'>
        <p>
          💡 <span className='font-bold text-hana-green'>안정형 투자자</span>에
          가까워요.
        </p>
        <p>
          전체 자산 중 <span className='font-semibold text-teal-600'>55%</span>
          가 안정적인 자산군(채권, 현금 등)에 투자되어 있어요.
        </p>
        <p>
          ✨ 위험 자산에 대한 비중이 낮기 때문에{' '}
          <span className='font-semibold'>수익률은 다소 낮을 수</span> 있어요.
        </p>
        <p>
          목표 수익률을 높이려면{' '}
          <span className='font-semibold'>ETF나 해외 주식</span> 비중을 늘려보는
          것도 좋아요.
        </p>
      </div>

      <div className='mt-4 text-xs text-gray-400 flex items-center gap-2'>
        <BarChart4 className='w-4 h-4' />이 분석은 자산 구성 기준으로 자동
        판단된 결과예요.
      </div>
    </div>
  );
};

export default InvestmentStyle;
