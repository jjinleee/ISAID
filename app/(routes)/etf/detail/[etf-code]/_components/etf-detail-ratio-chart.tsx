'use client';

import { useEffect, useRef } from 'react';
import { RatioInfo } from '@/types/etf';
import ApexCharts from 'apexcharts';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface EtfDetailRatioChartProps {
  labels: string[];
  series: number[];
  ratioInfoList: RatioInfo[];
  showPie: boolean;
}

const COLORS = [
  '#5eead4',
  '#2dd4bf',
  '#14b8a6',
  '#0f766e',
  '#a7f3d0',
  '#34d399',
  '#059669',
  '#047857',
  '#064e3b',
  '#083f2e',
];

export default function EtfDetailRatioChart({
  labels,
  series,
  ratioInfoList,
  showPie,
}: EtfDetailRatioChartProps) {
  const data = labels.map((name, idx) => ({
    name,
    value: series[idx],
  }));

  return (
    <div className='flex flex-col gap-5 w-full'>
      <div className='w-full'>
        <div className='grid grid-cols-3 bg-primary text-white text-sm font-semibold px-4 py-2'>
          <div>구성종목명</div>
          <div className='text-right'>주식수(계약수)</div>
          <div className='text-right'>시가총액기준 구성비중</div>
        </div>
        {ratioInfoList.map((ratioInfo, idx) => (
          <div
            key={idx}
            className='grid grid-cols-3 items-center px-4 py-3 border-b border-hana-green cursor-pointer'
          >
            <div className='font-medium text-sm'>
              {ratioInfo.compstIssueName}
            </div>

            <div className='text-sm text-right'>
              {ratioInfo.compstIssueCu1Shares}
            </div>

            <div className='text-right text-sm font-medium'>
              {ratioInfo.compstRatio || '-'}
            </div>
          </div>
        ))}
      </div>
      {showPie && (
        <>
          <div className='flex items-center justify-center w-full gap-4 flex-col'>
            <ResponsiveContainer width={274} height={274}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={450}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#f9fafb',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                  itemStyle={{ fontSize: '14px', color: '#111827' }}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(2)}%`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <ul className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
              {data.map((item, idx) => (
                <li key={idx} className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block w-2.5 h-2.5 rounded-full'
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className='font-medium'>{item.name}</span>
                  </div>
                  <span className='text-gray-500'>
                    {item.value.toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
