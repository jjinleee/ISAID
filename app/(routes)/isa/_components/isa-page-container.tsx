'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import {
  MonthlyReturnsSummary,
  PieChartData,
  RebalancingResponse,
} from '@/types/isa';
import Account from './account';
import ContributionLimitAndCalendar from './contribution-limit';
import ISADetail from './isa-detail';

const ISAPageContainer = ({
  taxData,
  transactions,
  ptData,
  userName,
  monthlyReturnsData,
}: {
  taxData: any;
  transactions: any;
  monthlyReturnsData: MonthlyReturnsSummary;
  ptData: PieChartData[];
  userName: string;
}) => {
  const { setHeader } = useHeader();
  const [rebalancingData, setRebalancingData] = useState<RebalancingResponse>();

  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');

    const fetchRebalancingData = async () => {
      try {
        const res = await fetch('/api/isa/rebalancing');
        if (!res.ok)
          throw new Error('리밸런싱 정보를 불러오는 데 실패했습니다.');
        const rawData: RebalancingResponse = await res.json();

        const mappedData: RebalancingResponse = {
          ...rawData,
          rebalancingOpinions: rawData.rebalancingOpinions.map((item) => {
            let category = item.category;
            if (category === '국내 주식') category = '국내 ETF';
            else if (category === '해외 주식') category = '해외 ETF';
            return { ...item, category };
          }),
        };

        setRebalancingData(mappedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRebalancingData();
  }, []);

  return (
    <div className='flex-col px-5 pb-5 flex flex-1/2'>
      <Account />
      <ContributionLimitAndCalendar transactions={transactions} />
      <ISADetail
        taxData={taxData}
        monthlyReturnsData={monthlyReturnsData}
        ptData={ptData}
        userName={userName}
        rebalancingData={rebalancingData}
      />
    </div>
  );
};

export default ISAPageContainer;
