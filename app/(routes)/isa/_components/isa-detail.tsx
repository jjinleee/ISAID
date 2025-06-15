'use client';

import { useState } from 'react';
import Tab from '@/components/tab';

const ISADetail = () => {
  const tabs = ['수익률', '포트폴리오', '절세계산기', '가이드'];
  const [selectedTab, setSelectedTab] = useState(0);
  return (
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
  );
};

export default ISADetail;
