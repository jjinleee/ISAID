'use client';

import { useState } from 'react';
import {
  MonthlyReturnsSummary,
  PieChartData,
  RebalancingResponse,
} from '@/types/isa';
import Tab from '@/components/tab';
import Calculate from './calculate';
import Portfolio from './portfolio';
import ProfitReport from './profit-report';

const ISADetail = ({
  taxData,
  ptData,
  userName,
  monthlyReturnsData,
  rebalancingData,
}: {
  taxData: any;
  monthlyReturnsData: MonthlyReturnsSummary;
  ptData: PieChartData[];
  userName: string;
  rebalancingData?: RebalancingResponse;
}) => {
  const tabs = ['수익률', '포트폴리오', '절세 리포트'];
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between w-full cursor-pointer'>
        {tabs.map((label, idx) => (
          <Tab
            key={idx}
            text={label}
            active={selectedTab === idx}
            rounded={false}
            onClick={() => setSelectedTab(idx)}
          />
        ))}
      </div>

      <div className='flex flex-col'>
        {selectedTab == 0 && (
          <ProfitReport monthlyReturnsData={monthlyReturnsData} />
        )}
        {selectedTab == 1 && (
          <Portfolio
            ptData={ptData}
            userName={userName}
            rebalancingData={rebalancingData}
          />
        )}
        {selectedTab == 2 && (
          <Calculate taxData={taxData} userName={userName} />
        )}
      </div>
    </div>
  );
};

export default ISADetail;
