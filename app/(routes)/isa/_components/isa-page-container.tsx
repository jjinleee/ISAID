'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { MonthlyReturnsSummary } from '@/types/isa';
import { PieChartData } from '@/types/isa';
import Account from './account';
import ContributionLimitAndCalendar from './contribution-limit';
import ISADetail from './isa-detail';

const ISAPageContainer = ({
  taxData,
  transactions,
  ptData,
  monthlyReturnsData,
}: {
  taxData: any;
  transactions: any;
  monthlyReturnsData: MonthlyReturnsSummary;
  ptData: PieChartData[];
}) => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');
  }, []);

  return (
    <div className='flex-col px-5 pb-5 flex flex-1/2'>
      <Account />
      <ContributionLimitAndCalendar transactions={transactions} />
      <ISADetail taxData={taxData} monthlyReturnsData={monthlyReturnsData} ptData={ptData}/>
    </div>
  );
};

export default ISAPageContainer;
