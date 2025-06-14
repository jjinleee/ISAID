'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/header-context';

const TestStepContainer = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ETF 맞춤 추천', '당신의 투자 성향에 맞는 테마');
  }, []);

  return <div className='flex flex-col px-6 py-10'></div>;
};

export default TestStepContainer;
