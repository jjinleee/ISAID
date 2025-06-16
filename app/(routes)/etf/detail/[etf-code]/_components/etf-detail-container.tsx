'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import ArrowCross from '@/public/images/arrow-cross';
import Tab from '@/components/tab';
import { formatComma } from '@/lib/utils';
import EftDetailChart from '../_components/etf-detail-chart';
import EtfDetailRatioChart from '../_components/etf-detail-ratio-chart';
import EtfDetailTable from '../_components/etf-detail-table';
import Skeleton from '../_components/skeleton';
import { etfDetailMap } from '../data/etf-detail-data';
import { etfRatioData } from '../data/etf-detail-ratio-data';

const EtfDetailContainer = () => {
  const params = useParams();

  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader(etf.categoryId, '당신의 투자 성향에 맞는 테마');
  }, []);

  const etfCode = params['etf-code'] as string;
  const etf = etfDetailMap[etfCode as keyof typeof etfDetailMap];

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [chartReady, setChartReady] = useState(false);

  if (!etf) return <div>해당 ETF가 존재하지 않습니다.</div>;
  const periods = ['1주일', '1개월', '3개월', '1년', '3년'];
  const tabs = ['기본정보', '구성 비중'];

  return (
    <>
      <div className='p-6 flex flex-col items-center gap-5 w-full pt-21'>
        {/* 헤더 */}
        <div className='flex flex-col gap-5 w-full'>
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-semibold'>{etf.categoryId}</p>
            <div className=''>
              <span className='text-xl font-bold mr-2'>{etf.name}</span>
              <span className='text-sm text-gray-500 mb-4'>{etf.code}</span>
            </div>
          </div>
          <div className='flex items-end'>
            <span className='text-xl font-bold mr-2 leading-none'>
              {formatComma(etf.price)}
            </span>
            <ArrowCross direction={`${etf.rate > 0 ? 'up' : 'down'}`} />
            <span
              className={`text-xs leading-none ${etf.rate > 0 ? 'text-hana-red' : 'text-blue'}`}
            >
              {etf.rate > 0 ? `+${etf.rate} %` : `${etf.rate} %`}
            </span>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <div className='flex items-center gap-1'>
              <div className=''>
                <p>iNAV</p>
                <p>{formatComma(etf.iNav)}</p>
              </div>
              <p
                className={`${etf.iNavRate > 0 ? 'text-hana-red' : 'text-blue'}`}
              >
                ({etf.iNavRate > 0 ? `+${etf.iNavRate}%` : `${etf.iNavRate}%`})
              </p>
            </div>
            <div className='text-end'>
              <p>거래량</p>
              <p>{formatComma(etf.volume)}주</p>
            </div>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          {periods.map((label, idx) => (
            <Tab
              key={idx}
              text={label}
              active={selectedPeriod === idx}
              rounded={false}
              onClick={() => setSelectedPeriod(idx)}
            />
          ))}
        </div>
        <div className='w-full'>
          <div className='relative w-full h-[350px]'>
            {!chartReady && (
              <div className='absolute top-0 left-0 w-full h-full z-10'>
                <Skeleton height={350} />
              </div>
            )}
            <EftDetailChart
              selectedPeriod={selectedPeriod}
              onReady={() => setChartReady(true)}
            />
          </div>
        </div>
        <div className='flex justify-between w-full'>
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
        {selectedTab === 0 && <EtfDetailTable etf={etf} />}
        {selectedTab === 1 && (
          <EtfDetailRatioChart
            labels={etfRatioData.labels}
            series={etfRatioData.series}
          />
        )}
      </div>
    </>
  );
};

export default EtfDetailContainer;
