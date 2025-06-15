'use client';

import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { etfPriceData } from '../data/etf-price-data';

export const EftDetailChart = ({
  selectedPeriod,
}: {
  selectedPeriod: number;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ApexCharts | null>(null);

  // 최초 렌더링: 3년치 전체 데이터를 기반으로 생성
  useEffect(() => {
    if (!chartRef.current) return;

    const fullSet = etfPriceData['3년'];
    const seriesData = fullSet.categories.map((dateStr, i) => {
      const timestamp = new Date(dateStr).getTime();
      return [timestamp, fullSet.data[i]];
    });
    console.log(seriesData.filter(([x, y]) => isNaN(x) || isNaN(y)));

    const options = {
      chart: {
        id: 'etf-area',
        type: 'area',
        height: 350,
        zoom: { enabled: false },
        toolbar: { show: false },
        selection: {
          enabled: false,
        },
      },
      dataLabels: { enabled: false },
      series: [
        {
          name: '수익률',
          data: seriesData,
        },
      ],
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: -30,
          style: { fontSize: '10px' },
        },
        tickAmount: 6,
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        x: { format: 'MM/dd' },
        y: {
          formatter: (val: number) => `${val.toFixed(2)}원`,
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();
    chartInstanceRef.current = chart;

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart) return;

    const fullDates = etfPriceData['3년'].categories;
    const end = new Date(fullDates[fullDates.length - 1]).getTime();
    let start: number;

    switch (selectedPeriod) {
      case 0:
        start = end - 7 * 86400000;
        break; // 1주일
      case 1:
        start = end - 30 * 86400000;
        break; // 1개월
      case 2:
        start = end - 90 * 86400000;
        break; // 3개월
      case 3:
        start = end - 365 * 86400000;
        break; // 1년
      case 4:
      default:
        start = new Date(fullDates[0]).getTime();
        break; // 3년 (전체)
    }

    chart.zoomX(start, end);
  }, [selectedPeriod]);

  return <div ref={chartRef} />;
};

export default EftDetailChart;
