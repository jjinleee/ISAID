import { EtfApiItem } from '@/types/etf';
import { clsx, type ClassValue } from 'clsx';
import { addDays, formatISO, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export interface EtfTableRow {
  etfId: string;
  name: string;
  code: string;
  company: string;
  volume: string;
  price: string;
  changeRate: string;
}

export interface EtfItem {
  etfId: string;
  name: string;
  code: string;
  volume: string;
  price: string;
  changeRate: string;
}

interface RawRatioItem {
  compstIssueName: string;
  compstIssueCu1Shares: string;
  compstRatio: number | string | null;
  recalculatedRatio: number;
}
interface RawRatioResponse {
  data: RawRatioItem[];
  hasRecalculated: boolean;
}

export interface EtfRatioData {
  labels: string[];
  series: number[];
}

type ChartRow = {
  date: string;
  closePrice: number;
  isInterpolated?: boolean;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatComma(value: number | string): string {
  const number = typeof value === 'string' ? Number(value) : value;
  return number.toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const mapApiToRow = (item: EtfApiItem): EtfTableRow => ({
  etfId: item.etfId,
  name: item.issueName,
  code: item.issueCode,
  company: '',
  volume: item.accTradeVolume.toLocaleString(),
  price: (+item.tddClosePrice).toLocaleString(),
  changeRate: `${item.flucRate.startsWith('-') ? '' : '+'}${item.flucRate}%`,
});

export const formatDate = (iso: string): string => {
  const date = new Date(iso);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}.${mm}.${dd}`;
};

export function toEtfRatioData(
  raw: RawRatioResponse,
  useRecalc: boolean = true
): EtfRatioData {
  const labels: string[] = [];
  const series: number[] = [];

  raw.data.forEach((item) => {
    labels.push(item.compstIssueName);

    const ratioSource =
      useRecalc || item.compstRatio == null
        ? item.recalculatedRatio
        : item.compstRatio;

    series.push(
      typeof ratioSource === 'string' ? parseFloat(ratioSource) : ratioSource
    );
  });

  return { labels, series };
}

export function fillGapsBetweenSingleMonthData(data: ChartRow[]): ChartRow[] {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const monthMap = new Map<string, ChartRow[]>();
  for (const row of sorted) {
    const m = row.date.slice(0, 7);
    if (!monthMap.has(m)) monthMap.set(m, []);
    monthMap.get(m)!.push(row);
  }
  const result: ChartRow[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    const currCount = monthMap.get(curr.date.slice(0, 7))?.length ?? 0;
    const nextCount = monthMap.get(next.date.slice(0, 7))?.length ?? 0;
    const shouldInterp = currCount === 1 && nextCount >= 1;
    result.push(curr);
    if (shouldInterp) {
      const startDate = parseISO(curr.date);
      const endDate = parseISO(next.date);
      const totalDays = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      const priceGap = next.closePrice - curr.closePrice;
      const avgStep = Math.abs(priceGap) / totalDays;

      const noiseRange = Math.max(
        Math.ceil(avgStep * 3),
        Math.ceil(Math.abs(priceGap) * 0.15)
      );

      for (let d = 1; d < totalDays; d++) {
        const date = formatISO(addDays(startDate, d), {
          representation: 'date',
        });
        const base = curr.closePrice + (priceGap * d) / totalDays;
        const noise =
          Math.floor(Math.random() * (2 * noiseRange + 1)) - noiseRange;
        result.push({
          date,
          closePrice: Math.round(base + noise),
          isInterpolated: true,
        });
      }
    }
  }
  result.push(sorted[sorted.length - 1]);
  const existing = new Set(data.map((d) => d.date));
  const merged = [...data];
  for (const r of result) {
    if (!existing.has(r.date)) merged.push(r);
  }
  return merged.sort((a, b) => a.date.localeCompare(b.date));
}
