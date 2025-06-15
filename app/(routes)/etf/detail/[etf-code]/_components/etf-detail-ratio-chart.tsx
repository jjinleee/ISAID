'use client';

import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface EtfDetailRatioChartProps {
  labels: string[];
  series: number[];
}

export default function EtfDetailRatioChart({
  labels,
  series,
}: EtfDetailRatioChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

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
    <div
      ref={chartRef}
      className='flex justify-center items-center w-full'
      id='donut-chart'
    />
  );
}
