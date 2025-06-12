'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';

const ISAPageContainer = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA 계좌', 'Individual Savings Account');
  }, []);

  return <div className='flex-col p-5 flex flex-1/2'></div>;
};

export default ISAPageContainer;
