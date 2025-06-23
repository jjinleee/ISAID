'use client';

import { useEffect, useRef, useState } from 'react';
import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';
import { MonthlyReturnsSummary } from '@/types/isa';
import { ArrowDownRight, ArrowUpRight, BarChart2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatComma } from '@/lib/utils';

const ProfitReport = ({
  monthlyReturnsData,
}: {
  monthlyReturnsData: MonthlyReturnsSummary;
}) => {
  const [selectedReport, setSelectedReport] =
    useState<MonthlyReturnsSummary>(monthlyReturnsData);

  // useEffect(() => {
  //   console.log('selectedReport : ', selectedReport);
  //   // setCurrentRate(selectedReport.returns[])
  // }, [selectedReport]);

  const chartData = selectedReport.returns.map((entry) => {
    const [date, rate] = Object.entries(entry)[0];
    const monthLabel = `${new Date(date).getMonth() + 1}월`;
    return { month: monthLabel, rate };
  });

  const latestEntry = selectedReport.returns.at(-1);
  const [currentRate, setCurrentRate] = useState(
    latestEntry ? Object.values(latestEntry)[0] : 0
  ); // 전체 수익률
  const [selectedMonth, setSelectedMonth] = useState('5');
  const currentRateIsUp = currentRate >= 0;

  const prevEntry = selectedReport.returns.at(-2);
  const lastMonthRate = prevEntry ? Object.values(prevEntry)[0] : 0; // 전월 수익률

  const diff = +(currentRate - lastMonthRate).toFixed(2); // 전월 대비 수익률 차이
  const isUp = diff >= 0;

  const evaluatedProfit = selectedReport.evaluatedProfit; // 평가 수익

  const evaluatedAmount = selectedReport.evaluatedAmount; // 평가 금액

  const xAxisRef = useRef<any>(null);

  useEffect(() => {
    const rateEntry = selectedReport.returns[Number(selectedMonth) - 1];
    const value = rateEntry ? Object.values(rateEntry)[0] : 0;

    setCurrentRate(value);
    console.log('current rate', currentRate);
  }, [selectedMonth, selectedReport]);

  useEffect(() => {
    setSelectedReport(monthlyReturnsData);
  }, [monthlyReturnsData]);

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
          <p
            className={`${evaluatedProfit >= 0 ? 'text-hana-green' : 'text-blue-500'} font-bold text-lg`}
          >
            {evaluatedProfit >= 0
              ? `+${formatComma(evaluatedProfit)} 원`
              : `-${formatComma(evaluatedProfit)} 원`}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>평가 금액</p>
          <p className='text-blue-500 font-bold text-lg'>
            {formatComma(evaluatedAmount)}원
          </p>
        </div>
      </div>

      {/* 그래프 */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <ResponsiveContainer width='100%' height={160}>
          <BarChart data={chartData} barCategoryGap={10}>
            <XAxis
              dataKey='month'
              stroke='#94a3b8'
              fontSize={12}
              tickLine={false}
              ref={xAxisRef}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value: number) => [`${value}%`, '수익률']}
              labelFormatter={(label) => `${label}`}
              cursor={{ fill: 'transparent' }}
            />
            <Bar
              dataKey='rate'
              barSize={24}
              radius={[6, 6, 0, 0]}
              isAnimationActive
              cursor='pointer'
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.rate > 0 ? '#10b981' : '#dc2626'}
                />
              ))}
            </Bar>
            {chartData.map((entry, index) => (
              <rect
                key={`click-area-${index}`}
                x={index * (100 / chartData.length) + '%'}
                width={`${100 / chartData.length}%`}
                y={0}
                height={160}
                fill='transparent'
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  const monthNumber = entry.month.replace('월', '') as
                    | '1'
                    | '2'
                    | '3'
                    | '4'
                    | '5'
                    | '6';
                  const updatedReport = await getMonthlyReturns(
                    monthNumber as '1' | '2' | '3' | '4' | '5' | '6'
                  );
                  setSelectedMonth(monthNumber);
                  setSelectedReport(updatedReport);
                }}
              />
            ))}
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
