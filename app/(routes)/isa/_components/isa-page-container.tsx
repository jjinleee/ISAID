'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import Account from './account';
import ContributionLimit from './contribution-limit';
import ISADetail from './isa-detail';

const ISAPageContainer = ({ taxData }: { taxData: any }) => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');
  }, []);

  return (
    <div className='flex-col px-5 pb-5 flex flex-1/2'>
      <Account />
      <ContributionLimit />
      <ISADetail taxData={taxData} />
    </div>
  );
};

export default ISAPageContainer;
