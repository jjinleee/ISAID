'use client';

import { MonthlyReturnsSummary } from '@/types/isa';
import { ArrowDownRight, ArrowUpRight, BarChart2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// const currentRate = 8.2;
// const lastMonthRate = 5.4;
// const diff = +(currentRate - lastMonthRate).toFixed(1);
// const isUp = diff >= 0;

const ProfitReport = ({
  monthlyReturnsData,
}: {
  monthlyReturnsData: MonthlyReturnsSummary;
}) => {
  console.log('monthlyReturnsData : ', monthlyReturnsData);
  const chartData = monthlyReturnsData.returns.map((entry) => {
    const [date, rate] = Object.entries(entry)[0];
    const monthLabel = `${new Date(date).getMonth() + 1}월`;
    return { month: monthLabel, rate };
  });
  const latestEntry = monthlyReturnsData.returns.at(-1);
  const currentRate = latestEntry ? Object.values(latestEntry)[0] : 0; // 전체 수익률
  const currentRateIsUp = currentRate >= 0;

  const prevEntry = monthlyReturnsData.returns.at(-2);
  const lastMonthRate = prevEntry ? Object.values(prevEntry)[0] : 0; // 전월 수익률

  const diff = +(currentRate - lastMonthRate).toFixed(2); // 전월 대비 수익률 차이
  const isUp = diff >= 0;

  const evaluatedProfit = monthlyReturnsData.evaluatedProfit; // 평가 수익

  const evaluatedAmount = monthlyReturnsData.evaluatedAmount; // 평가 금액

  return (
    <div className='rounded-xl bg-white px-4 py-5 shadow-sm mt-4'>
      {/* 헤더 */}
      <div className='flex items-center gap-2 mb-4'>
        <BarChart2 className='text-hana-green w-5 h-5' />
        <h2 className='font-semibold text-lg'>수익률 리포트</h2>
      </div>

      {/* 수익 개요 */}
      <div className='grid grid-cols-3 gap-4 text-center mb-6'>
        <div>
          <p className='text-sm text-gray-500'>전체 수익률</p>
          <div className='flex justify-center items-center gap-1'>
            <p
              className={`font-bold text-lg ${currentRate >= 0 ? 'text-hana-red ' : 'text-blue'}`}
            >
              {currentRate >= 0 ? `+${currentRate} %` : `-${currentRate} %`}
            </p>
            {currentRateIsUp ? (
              <ArrowUpRight className='w-4 h-4 text-hana-red' />
            ) : (
              <ArrowDownRight className='w-4 h-4 text-gray-400' />
            )}
          </div>
          <p className='text-xs text-gray-400'>
            전월 대비 {isUp ? '+' : ''}
            {diff}%
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>평가 수익</p>
          <p className='text-hana-green font-bold text-lg'>+690,000원</p>
          {evaluatedProfit}
        </div>
        <div>
          <p className='text-sm text-gray-500'>평가 금액</p>
          <p className='text-blue-500 font-bold text-lg'>9,190,000원</p>
        </div>
      </div>

      {/* 그래프 */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <ResponsiveContainer width='100%' height={160}>
          <BarChart data={chartData}>
            <XAxis
              dataKey='month'
              stroke='#94a3b8'
              fontSize={12}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value: number) => [`${value}%`, '수익률']}
              labelFormatter={(label) => `${label}`}
              cursor={{ fill: 'transparent' }}
            />
            <Bar
              dataKey='rate'
              fill='#10b981'
              barSize={24}
              radius={[6, 6, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
        <p className='text-xs text-center text-gray-400 mt-2'>
          월별 수익률 추이
        </p>
      </div>

      {/* 요약 멘트 */}
      <div className='mt-5 rounded-md bg-gray-2/30 text-sm text-gray-700 p-3 leading-snug'>
        이번 달에는 수익률이{' '}
        <span className='font-semibold text-emerald-600'>+{currentRate}%</span>
        로 전월보다 <span className='font-semibold'>{diff}%</span>{' '}
        {isUp ? (
          <>
            증가했어요{' '}
            <ArrowUpRight className='inline w-4 h-4 text-hana-green relative bottom-0.5' />
          </>
        ) : (
          <>
            감소했어요{' '}
            <ArrowDownRight className='inline w-4 h-4 text-hana-red relative bottom-0.5' />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitReport;
