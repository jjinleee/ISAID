'use client';

import { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import { EtfPeriod, etfPriceData } from '../data/etf-price-data';

const periodLabels: EtfPeriod[] = ['1주일', '1개월', '3개월', '1년', '3년'];

export const EtfDetailChart = ({
  selectedPeriod,
}: {
  selectedPeriod: number;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const period = periodLabels[selectedPeriod];

    const priceSet = etfPriceData[period];
    if (!priceSet) return;

    const { categories, data } = etfPriceData[period];

    const options = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: {
        enabled: false, // 🔹 데이터 위 숫자 숨김
      },

      series: [
        {
          name: '수익률',
          data,
        },
      ],
      xaxis: {
        categories,
        labels: {
          show: true,
          rotate: 0,
          hideOverlappingLabels: true,
          trim: true,
        },
        tickAmount: 6,
      },

      tooltip: {
        enabled: true,
        theme: 'light',
        y: {
          formatter: (val: number) => `${val.toFixed(2)}원`,
        },
      },
    };

    const chartInstance = new ApexCharts(chartRef.current, options);
    chartInstance.render();
    setChart(chartInstance);

    return () => {
      chartInstance.destroy();
    };
  }, [selectedPeriod]);

  return <div ref={chartRef} />;
};

export default EtfDetailChart;
