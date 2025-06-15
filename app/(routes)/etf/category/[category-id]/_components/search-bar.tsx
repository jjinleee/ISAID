'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Input from '@/components/input';
import CustomSelect from './custom-select';

type Filter = 'name' | 'code' | 'company';

interface Props {
  onChangeAction: (keyword: string, filter: Filter) => void;
}

export default function SearchBar({ onChangeAction }: Props) {
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<Filter>('name');
  const debounced = useDebounce(keyword, 400);

  useEffect(() => {
    onChangeAction(debounced, filter);
  }, [debounced, filter, onChangeAction]);

  const filterOptions = [
    { label: '종목명', value: 'name' },
    { label: '종목코드', value: 'code' },
    { label: '운용사', value: 'company' },
  ];

  useEffect(() => {
    console.log('filter : ', filter);
  }, [filter]);

  useEffect(() => {
    console.log('keyword : ', keyword);
  }, [keyword]);

  return (
    <div className='flex gap-2 mb-4'>
      <CustomSelect
        value={filter}
        options={filterOptions}
        onChangeAction={setFilter}
      />

      <Input
        thin={true}
        type='text'
        placeholder='검색어 입력'
        value={keyword}
        onChange={(keyword) => setKeyword(keyword)}
        name={'search'}
      />
    </div>
  );
}
