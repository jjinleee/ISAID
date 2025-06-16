'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import EtfSection from '@/app/(routes)/etf/category/[category-id]/_components/etf-section';
import { useHeader } from '@/context/header-context';
import { useDebounce } from '@/hooks/useDebounce';
import ArrowIcon from '@/public/images/arrow-icon';
import { Category, Filter } from '@/types/etf';
import { fetchEtfCategory, fetchEtfItems } from '@/lib/api/etf';
import { EtfItem, mapApiToRow } from '@/lib/utils';

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const SIZE = 10;
  const shouldEmpty = loadingItems && page === 1;

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loadingItems) {
        setPage((p) => p + 1);
      }
    },
    [hasMore, loadingItems]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [debounced, filter, selectedSubId]);

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
    if (!needFetch) {
      setEtfData([]);
      return;
    }

    const loadEtfData = async () => {
      setLoadingItems(true);
      try {
        const res = await fetchEtfItems(
          String(targetId),
          debounced,
          filter,
          page,
          SIZE
        );
        setTotalPages(res.total);
        setTableName(res.etfCategoryFullPath);

        setEtfData((prev) =>
          page === 1
            ? res.data.map(mapApiToRow)
            : [...prev, ...res.data.map(mapApiToRow)]
        );

        setHasMore(res.data.length === SIZE);
      } catch (e: any) {
        setError(e.message || 'ETF 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingItems(false);
      }
    };

    loadEtfData();
  }, [
    category,
    subCategory,
    debounced,
    filter,
    rawCategoryId,
    selectedSubId,
    page,
  ]);

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

  if (category.categories.length === 1) {
    return (

      <>
        <EtfSection
          title={tableName || category.displayName}
          count={shouldEmpty ? 0 : etfData.length}
          keyword={keyword}
          filter={filter}
          data={shouldEmpty ? [] : etfData}
          onKeywordChangeAction={setKeyword}
          onFilterChangeAction={setFilter}
          cleanUp={cleanUp}
          totalPages={totalPages}
        />

        {/* 추가 페이지 로딩 중일 때 하단 인디케이터만 표시 */}
        {loadingItems && page > 1 && (
          <div className='py-4 text-center text-sm text-gray'>로딩 중…</div>
        )}

        <div ref={sentinelRef} className='h-6' />
      </>
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
    <>
      <EtfSection
        title={tableName || category.displayName}
        count={shouldEmpty ? 0 : etfData.length}
        keyword={keyword}
        filter={filter}
        data={shouldEmpty ? [] : etfData}
        onKeywordChangeAction={setKeyword}
        onFilterChangeAction={setFilter}
        cleanUp={cleanUp}
        totalPages={totalPages}
      />

      {loadingItems && page > 1 && (
        <div className='py-4 text-center text-sm text-gray'>로딩 중…</div>
      )}

      <div ref={sentinelRef} className='h-6' />
    </>
  );
};
export default CategoryPageContainer;
