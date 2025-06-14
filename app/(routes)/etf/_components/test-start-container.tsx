'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/header-context';
import StayBoyTest from '@/public/images/star-boy-test.svg';
import Button from '@/components/button';

const TestContainer = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ETF 투자 성향 테스트', '당신의 투자 테스트 성향을 알아보세요');
  }, []);

  return (
    <div className='flex flex-col px-6 py-10'>
      <div className='flex flex-col gap-9 items-center'>
        <div className='flex flex-col gap-4 items-center'>
          <h1 className='text-2xl font-bold'>ETF 투자 성향 테스트</h1>
          <span className='text-sm font-light text-center text-subtitle'>
            간단한 테스트로 투자 성향을 파악하고,
            <br />
            맞춤형 ETF 테마를 추천받으세요
          </span>
        </div>
        <StayBoyTest />
        <Button
          text={'테스트 시작하기'}
          thin={false}
          active={false}
          className='!bg-gray'
        />
      </div>
    </div>
  );
};

export default TestContainer;
