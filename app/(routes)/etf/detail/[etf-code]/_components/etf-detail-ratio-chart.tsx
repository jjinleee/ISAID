'use client';

import { useEffect, useRef } from 'react';
import { RatioInfo } from '@/types/etf';
import ApexCharts from 'apexcharts';

interface EtfDetailRatioChartProps {
  labels: string[];
  series: number[];
  ratioInfoList: RatioInfo[];
  showPie: boolean;
}

export default function EtfDetailRatioChart({
  labels,
  series,
  ratioInfoList,
  showPie,
}: EtfDetailRatioChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current || !showPie) return;

    const options = {
      series,
      chart: {
        type: 'donut',
        width: '100%',
      },
      labels,
      legend: {
        position: 'right',
        fontSize: '12px',
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();
    return () => {
      chart.destroy();
    };
  }, [labels, series]);

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

      <div
        ref={chartRef}
        className='flex justify-center items-center w-full'
        id='donut-chart'
      />
    </div>
  );
}
