'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Input from '@/components/input';
import CustomSelect from './custom-select';

type Filter = 'name' | 'code';

interface Props {
  keyword: string;
  filter: Filter;
  onKeywordChangeAction: (kw: string) => void;
  onFilterChangeAction: (f: Filter) => void;
}

export default function SearchBar({
  keyword,
  filter,
  onKeywordChangeAction,
  onFilterChangeAction,
}: Props) {
  const filterOptions = [
    { label: '종목명', value: 'name' },
    { label: '종목코드', value: 'code' },
  ];

  return (
    <div className='flex gap-2 mb-4'>
      <CustomSelect
        value={filter}
        options={filterOptions}
        onChangeAction={(v: Filter) => onFilterChangeAction(v)}
      />

      <Input
        thin={true}
        type='text'
        placeholder='검색어 입력'
        value={keyword}
        onChange={(v) => onKeywordChangeAction(v)}
        name='search'
      />
    </div>
  );
}
