import { EtfApiItem } from '@/types/etf';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface EtfTableRow {
  name: string;
  code: string;
  company: string;
  volume: string;
  price: string;
  changeRate: string;
}

export interface EtfItem {
  name: string;
  code: string;
  volume: string;
  price: string;
  changeRate: string;
}

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
  name: item.issueName,
  code: item.issueCode,
  company: '',
  volume: item.accTradeVolume.toLocaleString(),
  price: (+item.tddClosePrice).toLocaleString(),
  changeRate: `${item.flucRate.startsWith('-') ? '' : '+'}${item.flucRate}%`,
});
