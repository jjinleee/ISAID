'use client';

import { useEffect } from 'react';
import { EtfItem } from '@/lib/utils';
import EtfTable from './etf-table';
import SearchBar from './search-bar';

type Filter = 'name' | 'code';

interface Props {
  title: string;
  count: number;
  keyword: string;
  filter: Filter;
  data: EtfItem[];
  onKeywordChangeAction: (v: string) => void;
  onFilterChangeAction: (v: Filter) => void;
  cleanUp?: () => void;
}

export default function EtfSection({
  title,
  count,
  keyword,
  filter,
  data,
  onKeywordChangeAction,
  onFilterChangeAction,
  cleanUp,
}: Props) {
  useEffect(() => {
    return () => {
      cleanUp?.();
    };
  }, []);
  return (
    <div className='flex flex-col gap-5 py-8 px-6'>
      <div className='flex gap-2 items-end'>
        <h1 className='font-semibold text-xl'>{title}</h1>
        <p className='text-sm text-gray'>{count} 종목</p>
      </div>

      <SearchBar
        keyword={keyword}
        filter={filter}
        onKeywordChangeAction={onKeywordChangeAction}
        onFilterChangeAction={onFilterChangeAction}
      />

      <EtfTable data={data} />
    </div>
  );
}
