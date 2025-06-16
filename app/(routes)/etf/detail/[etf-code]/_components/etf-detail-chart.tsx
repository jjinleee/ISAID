'use client';

import { useEffect, useMemo, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface ChartRow {
  date: string;
  closePrice: number;
}

interface Props {
  chartRows: ChartRow[];
  selectedPeriod: number;
  onReady?: () => void;
}

export default function EftDetailChart({
  chartRows,
  selectedPeriod,
  onReady,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  const seriesData = useMemo<[number, number][]>(
    () =>
      chartRows.map(({ date, closePrice }) => [
        new Date(date).getTime(),
        closePrice,
      ]),
    [chartRows]
  );

  const firstTs = seriesData[0]?.[0] ?? 0;
  const lastTs = seriesData[seriesData.length - 1]?.[0] ?? 0;
  const availDays = Math.floor((lastTs - firstTs) / 86400000);
  const needDays = [7, 30, 90, 365, 1095];

  const getRange = (period: number): [number, number] => {
    const need = needDays[period] ?? 1095;
    const start = need > availDays ? firstTs : lastTs - need * 86400000;
    return [start, lastTs];
  };

  useEffect(() => {
    if (!chartRef.current || seriesData.length === 0) {
      onReady?.();
      return;
    }

    const chart = new ApexCharts(chartRef.current, {
      chart: {
        id: 'etf-area',
        type: 'area',
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      series: [{ name: '가격', data: seriesData }],
      xaxis: {
        type: 'datetime',
        labels: { rotate: -30, style: { fontSize: '10px' } },
        tickAmount: 6,
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        x: { format: 'MM/dd' },
        y: {
          formatter: (value: number) => `${value.toFixed(2)}원`,
        },
      },
    });

    chart.render().then(() => {
      chartInstance.current = chart;
      const [s, e] = getRange(selectedPeriod);
      chart.zoomX(s, e);
      onReady?.();
    });

    return () => {
      chart.destroy();
      chartInstance.current = null;
    };
  }, [seriesData]);

  useEffect(() => {
    if (!chartInstance.current) return;
    const [s, e] = getRange(selectedPeriod);
    chartInstance.current.zoomX(s, e);
  }, [selectedPeriod]);

  return <div ref={chartRef} />;
}
