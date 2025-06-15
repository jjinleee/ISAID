import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
