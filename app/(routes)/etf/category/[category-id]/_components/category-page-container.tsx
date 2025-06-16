'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import { useDebounce } from '@/hooks/useDebounce';
import ArrowIcon from '@/public/images/arrow-icon';
import { Category } from '@/types/etf';
import { fetchEtfCategory, fetchEtfItems } from '@/lib/api/etf';
import { EtfItem, mapApiToRow } from '@/lib/utils';
import EtfTable from '../_components/etf-table';
import SearchBar from '../_components/search-bar';

type Filter = 'name' | 'code' | 'company';

const CategoryPageContainer = () => {
  const { setHeader } = useHeader();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 검색
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<Filter>('name');
  const debounced = useDebounce(keyword, 400);
  const [etfData, setEtfData] = useState<EtfItem[]>([]);

  const rawCategoryId = params['category-id'] as string;
  const subCategory = searchParams.get('sub') ?? '';

  const [category, setCategory] = useState<Category | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    setHeader('맞춤 테마 ETF', '당신의 투자 성향에 맞는 테마');
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoadingCategory(true);
        const data = await fetchEtfCategory(rawCategoryId);
        setCategory({
          displayName: data.displayName,
          categories: data.categories,
        });
      } catch (e: any) {
        setError(e.message || '카테고리 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoadingCategory(false);
      }
    };
    fetchCategory();
  }, [rawCategoryId]);

  useEffect(() => {
    if (!category) return;

    if (category.categories.length === 1 || subCategory) {
      const loadEtfData = async () => {
        setLoadingItems(true);
        try {
          const res = await fetchEtfItems(
            String(category.categories[0].id),
            debounced,
            filter
          );
          const rows = res.data.map(mapApiToRow);
          setEtfData(rows);
        } catch (e: any) {
          setError(
            e.message || 'ETF 데이터를 불러오는 중 오류가 발생했습니다.'
          );
        } finally {
          setLoadingItems(false);
        }
      };

      loadEtfData();
    } else {
      setEtfData([]);
    }
  }, [category, subCategory, debounced, filter, rawCategoryId]);

  if (loadingCategory)
    return <div className='px-6 py-8'>카테고리 불러오는 중...</div>;
  if (error) return <div className='px-6 py-8 text-red-500'>{error}</div>;

  if (!category) return <div>존재하지 않는 카테고리입니다.</div>;
  if (loadingItems)
    return (
      <div className='px-6 py-8'>
        <h1 className='font-semibold text-xl'>{category!.displayName}</h1>
        <div className='mt-6'>종목 데이터 불러오는 중...</div>
      </div>
    );
  if (category.categories.length === 1) {
    return (
      <div className='flex flex-col gap-5 py-8 px-6'>
        <div className='flex gap-2 items-end'>
          <h1 className='font-semibold text-xl'>{category.displayName}</h1>
          <p className='text-sm text-gray'>{etfData.length} 종목</p>
        </div>
        <SearchBar
          onChangeAction={(kw, f) => {
            setKeyword(kw);
            setFilter(f);
          }}
        />

        <EtfTable data={etfData} />
      </div>
    );
  }

  const handleClick = (sub: string) => {
    const encoded = encodeURIComponent(sub);
    router.push(`/etf/category/${rawCategoryId}?sub=${encoded}`);
  };

  if (!subCategory) {
    return (
      <div className='py-8 px-6'>
        <div className='flex flex-col gap-5'>
          <div className='flex gap-2 items-end'>
            <h1 className='font-semibold text-xl'>{category.displayName}</h1>
            <p className='text-sm text-gray'>
              {category.categories.length} 종목
            </p>
          </div>
          <div className='flex flex-col text-sm font-semibold '>
            <div className='bg-teal-500 text-white px-4 py-2'>분류</div>
            {category.categories.map((sub) => (
              <div
                key={sub.id}
                className='flex justify-between items-center px-4 py-3 border-b border-b-gray-2 cursor-pointer'
                onClick={() => handleClick(sub.name)}
              >
                {sub.name}
                <ArrowIcon direction='right' className='text-gray w-6 h-6' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 py-8 px-6'>
      <div className='flex gap-2 items-end'>
        <h1 className='font-semibold text-xl'>{category.displayName}</h1>
        <p className='text-sm text-gray'>{etfData.length} 종목</p>
      </div>
      <SearchBar
        onChangeAction={(kw, f) => {
          setKeyword(kw);
          setFilter(f);
        }}
      />

      <EtfTable data={etfData} />
    </div>
  );
};
export default CategoryPageContainer;
