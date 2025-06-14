'use client';

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import EtfTable from '@/app/(routes)/etf/category/[category-id]/_components/etf-table';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import { categoryMap, etfData } from '../data/category-data';

const CategoryPageContainer = () => {
  const { setHeader } = useHeader();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCategoryId = params['category-id'] as string;
  const subCategory = searchParams.get('sub') ?? '';

  const category = categoryMap[rawCategoryId as keyof typeof categoryMap];
  console.log('category : ', category);
  useEffect(() => {
    setHeader('맞춤 테마 ETF', '당신의 투자 성향에 맞는 테마');
  }, []);

  if (!category) return <div>존재하지 않는 카테고리입니다.</div>;

  if (category.subCategories.length === 0) {
    return (
      <div className='py-8 px-6'>
        <h1 className='text-xl font-bold mb-4'>{category.displayName}</h1>
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
        <div className='w-full flex flex-col gap-5'>
          <div className='flex gap-2 items-end'>
            <h1 className='font-semibold text-xl'>{category.displayName}</h1>
            <p className='text-sm text-gray'>
              {category.subCategories.length} 분류
            </p>
          </div>
          <div className='flex flex-col text-sm font-semibold '>
            <div className='bg-teal-500 text-white px-4 py-2'>분류</div>
            {category.subCategories.map((sub) => (
              <div
                key={sub}
                className='flex justify-between items-center px-4 py-3 border-b border-b-gray-2 cursor-pointer'
                onClick={() => handleClick(sub)}
              >
                {sub}
                <ArrowIcon direction='right' className='text-gray w-6 h-6' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='py-8 px-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl font-bold'>{category.displayName}</h1>
        <p className='text-sm text-gray'>{subCategory}</p>
      </div>
      <EtfTable data={etfData} />
    </div>
  );
};
export default CategoryPageContainer;
