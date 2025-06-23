'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/header-context';

const ISAPageContainerWhenHasnot = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');
  }, []);

  return (
    <div>
      <p>계좌를 연결하면 사용할 수 있는 기능입니다!</p>
    </div>
  );
};

export default ISAPageContainerWhenHasnot;
