'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import Account from './account';
import ContributionLimit from './contribution-limit';

const ISAPageContainer = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');
  }, []);

  return (
    <div className='flex-col p-5 flex flex-1/2 pt-21'>
      <Account />
      <ContributionLimit />
    </div>
  );
};

export default ISAPageContainer;
