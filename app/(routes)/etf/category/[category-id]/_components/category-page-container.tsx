'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import EtfSection from '@/app/(routes)/etf/category/[category-id]/_components/etf-section';
import { useHeader } from '@/context/header-context';
import { useDebounce } from '@/hooks/useDebounce';
import ArrowIcon from '@/public/images/arrow-icon';
import { Category } from '@/types/etf';
import { fetchEtfCategory, fetchEtfItems } from '@/lib/api/etf';
import { EtfItem, mapApiToRow } from '@/lib/utils';

type Filter = 'name' | 'code';

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
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  const [error, setError] = useState('');

  const [tableName, setTableName] = useState<string>('');

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

    const targetId =
      selectedSubId ??
      (category.categories.length ? category.categories[0].id : null);

    if (!targetId) return;

    const needFetch =
      category.categories.length === 1 ||
      (Boolean(subCategory) && selectedSubId !== null);

    if (needFetch) {
      const loadEtfData = async () => {
        setLoadingItems(true);
        try {
          const res = await fetchEtfItems(String(targetId), debounced, filter);
          setTableName(res.etfCategoryFullPath);
          setEtfData(res.data.map(mapApiToRow));
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
  }, [category, subCategory, debounced, filter, rawCategoryId, selectedSubId]);
  useEffect(() => {
    if (!subCategory) setSelectedSubId(null);
  }, [subCategory]);

  const cleanUp = () => {
    setTableName('');
  };

  if (loadingCategory)
    return <div className='px-6 py-8'>카테고리 불러오는 중...</div>;
  if (error) return <div className='px-6 py-8 text-hana-red'>{error}</div>;

  if (!category) return <div>존재하지 않는 카테고리입니다.</div>;
  if (loadingItems)
    return (
      <EtfSection
        title={tableName || category.displayName}
        count={0}
        keyword={keyword}
        filter={filter}
        data={[]}
        onKeywordChangeAction={setKeyword}
        onFilterChangeAction={setFilter}
        cleanUp={cleanUp}
      />
    );
  if (category.categories.length === 1) {
    return (
      <EtfSection
        title={tableName || category.displayName}
        count={etfData.length}
        keyword={keyword}
        filter={filter}
        data={etfData}
        onKeywordChangeAction={setKeyword}
        onFilterChangeAction={setFilter}
        cleanUp={cleanUp}
      />
    );
  }

  const handleClick = (id: number, sub: string, fullName: string) => {
    setSelectedSubId(id);
    const encoded = encodeURIComponent(sub);
    router.push(`/etf/category/${rawCategoryId}?sub=${encoded}`);
  };

  if (!subCategory) {
    return (
      <div className='py-8 px-6'>
        <div className='flex flex-col gap-5'>
          <div className='flex gap-2 items-end'>
            <h1 className='font-semibold text-xl'>
              {tableName || category.displayName}
            </h1>
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
                onClick={() => handleClick(sub.id, sub.name, sub.fullname)}
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
    <EtfSection
      title={tableName || category.displayName}
      count={etfData.length}
      keyword={keyword}
      filter={filter}
      data={etfData}
      onKeywordChangeAction={setKeyword}
      onFilterChangeAction={setFilter}
      cleanUp={cleanUp}
    />
  );
};
export default CategoryPageContainer;
