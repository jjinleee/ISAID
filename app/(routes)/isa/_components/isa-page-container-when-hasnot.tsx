'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/header-context';

const ISAPageContainerWhenHasnot = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');
  }, []);

  return (
    <div className='flex justify-center items-center w-full min-h-screen'>
      <p>
        이 페이지의 기능들을 이용하려면 <br />
        먼저 ISA 계좌를 연결해 주세요!
      </p>
    </div>
  );
};

export default ISAPageContainerWhenHasnot;
