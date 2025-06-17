import { Category, EtfDetailResponse } from '@/types/etf';
import type { EtfApiResponse } from '@/types/etf';

export const fetchEtfCategory = async (
  rawCategoryId: string
): Promise<Category> => {
  const res = await fetch(`/api/etf/theme/${rawCategoryId}`);
  if (!res.ok) {
    throw new Error('카테고리 정보를 불러오는 데 실패했습니다.');
  }
  const data = await res.json();

  return {
    displayName: data.displayName,
    categories: data.categories,
  };
};

export const fetchEtfItems = async (
  rawCategoryId: string,
  keyword: string = '',
  filter: 'name' | 'code' = 'name',
  page: number = 1,
  size: number = 20
): Promise<EtfApiResponse> => {
  const searchParams = new URLSearchParams({
    keyword,
    filter,
    page: String(page),
    size: String(size),
  });

  const res = await fetch(
    `/api/etf/category/${rawCategoryId}?${searchParams.toString()}`
  );

  if (!res.ok) {
    throw new Error('ETF 데이터를 불러오는 데 실패했습니다.');
  }
  return res.json();
};

export const fetchEtfDetails = async (
  eftId: string
): Promise<EtfDetailResponse> => {
  const res = await fetch(`/api/etf/${eftId}`);
  return res.json();
};

export const fetchEtfRatio = async (etfId: string) => {
  const res = await fetch(`/api/etf/${etfId}/pdf`);
  return res.json();
};
