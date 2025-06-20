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

export const formatProfilePHN = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-****`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-****`;
  }

  if (digits.length === 9 && digits.startsWith('02')) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-****`;
  }

  if (digits.length === 10 && !digits.startsWith('01')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-****`;
  }

  return raw;
};

export const maskProfileEmail = (email: string): string => {
  const [local, domain] = email.split('@');

  const visibleLen = Math.ceil(local.length / 2);
  const maskedPart = '*'.repeat(local.length - visibleLen);
  const masked = local.slice(0, visibleLen) + maskedPart;

  return `${masked}@${domain}`;
};

export const validateField = <T extends Record<string, any>>(
  field: keyof T,
  value: string,
  formData: T
): boolean => {
  switch (field) {
    case 'name':
      return value.trim().length > 0;

    case 'nameEng':
      return (
        value === '' || (/^[A-Z ]+$/.test(value) && value.trim().length > 0)
      );

    case 'rrn':
      return /^[0-9]{13}$/.test(value);

    case 'phone':
      return /^\d{11,12}$/.test(value);

    case 'verificationCode':
      return /^\d{3}$/.test(value);

    case 'address':
      return value.trim().length > 0;

    case 'telNo':
      return value === '' || /^\d{2,10}$/.test(value);

    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    case 'password':
      return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);

    case 'passwordConfirm':
      return value === formData.password && value.length > 0;

    default:
      return true;
  }
};

export const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

export const formatTelNo = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (!digits) return '';

  const areaLen = digits.startsWith('02') ? 2 : 3;
  const area = digits.slice(0, areaLen);
  const rest = digits.slice(areaLen);

  const len = rest.length;
  if (len <= 4) {
    return area + rest;
  }

  if (len <= 6) {
    return `${area}-${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  const prefix = rest.slice(0, len - 4);
  const suffix = rest.slice(len - 4);
  return `${area}-${prefix}-${suffix}`;
};

export const formatHanaAccountNumber = (raw: string) => {
  const onlyDigits = raw.replace(/\D/g, '').slice(0, 13);
  return onlyDigits.replace(/(\d{3})(\d{6})(\d{0,4})/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join('-')
  );
};

export const addYears = (isoDateStr: string, years: number): string => {
  const date = new Date(isoDateStr);
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString(); // 필요 시 다른 포맷으로 변환 가능
};
