'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import { useDebounce } from '@/hooks/useDebounce';
import ArrowIcon from '@/public/images/arrow-icon';
import EtfTable from '../_components/etf-table';
import SearchBar from '../_components/search-bar';
import { etfData } from '../data/category-data';

type Filter = 'name' | 'code' | 'company';

interface SubCategory {
  id: number;
  name: string;
  fullname: string;
}

interface Category {
  displayName: string;
  subCategories: SubCategory[];
}

const CategoryPageContainer = () => {
  const { setHeader } = useHeader();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 검색
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<Filter>('name');
  const debounced = useDebounce(keyword, 400);

  const filteredData = useMemo(() => {
    const kw = debounced.trim().toLowerCase();
    if (!kw) return etfData;
    return etfData.filter((etf) => etf[filter].toLowerCase().includes(kw));
  }, [debounced, filter]);

  const rawCategoryId = params['category-id'] as string;
  const subCategory = searchParams.get('sub') ?? '';

  // const category = categoryMap[rawCategoryId as keyof typeof categoryMap];
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setHeader('맞춤 테마 ETF', '당신의 투자 성향에 맞는 테마');
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/etf/theme/${rawCategoryId}`);
        if (!res.ok)
          throw new Error('카테고리 정보를 불러오는 데 실패했습니다.');
        const data = await res.json();
        setCategory({
          displayName: data.displayName,
          subCategories: data.categories,
        });
      } catch (e: any) {
        setError(e.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [rawCategoryId]);

  if (loading) return <div className='px-6 py-8'>로딩 중...</div>;
  if (error) return <div className='px-6 py-8 text-red-500'>{error}</div>;
  if (!category) return <div>존재하지 않는 카테고리입니다.</div>;

  if (category.subCategories.length === 1) {
    return (
      <div className='flex flex-col gap-5 pb-8 pt-21 px-6'>
        <div className='flex gap-2 items-end'>
          <h1 className='font-semibold text-xl'>{category.displayName}</h1>
          <p className='text-sm text-gray'>{filteredData.length} 종목</p>
        </div>
        <SearchBar
          onChangeAction={(kw, f) => {
            setKeyword(kw);
            setFilter(f);
          }}
        />

        <EtfTable data={filteredData} />
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
              {category.subCategories.length} 종목
            </p>
          </div>
          <div className='flex flex-col text-sm font-semibold '>
            <div className='bg-teal-500 text-white px-4 py-2'>분류</div>
            {category.subCategories.map((sub) => (
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
        <p className='text-sm text-gray'>{filteredData.length} 종목</p>
      </div>
      <SearchBar
        onChangeAction={(kw, f) => {
          setKeyword(kw);
          setFilter(f);
        }}
      />

      <EtfTable data={filteredData} />
    </div>
  );
};
export default CategoryPageContainer;
