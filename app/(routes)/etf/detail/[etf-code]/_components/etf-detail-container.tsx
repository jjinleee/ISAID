'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import ArrowCross from '@/public/images/arrow-cross';
import { EtfDetail, EtfDetailResponse, EtfIntro, RatioInfo } from '@/types/etf';
import { Loading } from '@/components/loading';
import Tab from '@/components/tab';
import { fetchEtfDetails, fetchEtfRatio } from '@/lib/api/etf';
import { EtfRatioData, formatComma, toEtfRatioData } from '@/lib/utils';
import EftDetailChart from '../_components/etf-detail-chart';
import EtfDetailRatioChart from '../_components/etf-detail-ratio-chart';
import EtfDetailTable from '../_components/etf-detail-table';
import Skeleton from '../_components/skeleton';

const emptyRatioData: EtfRatioData = { labels: [], series: [] };
const emptyRatioInfo: RatioInfo[] = [
  {
    compstIssueCu1Shares: '',
    compstIssueName: '',
    compstRatio: '',
  },
];
interface EtfDetailContainerProps {
  etfCode: string;
  initialChart: {
    date: string;
    closePrice: number;
  }[];
}
export default function EtfDetailContainer({
  etfCode,
  initialChart,
}: EtfDetailContainerProps) {
  const [etfResponse, setEtfResponse] = useState<EtfDetailResponse>();
  const [etfIntro, setEtfIntro] = useState<EtfIntro>();
  const [etfDetail, setEtfDetail] = useState<EtfDetail>();
  const [chartRows] = useState(initialChart);
  const [showPie, setShowPie] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { setHeader } = useHeader();

  const loadDetailAndRatio = async (id: string) => {
    setIsLoading(true);

    const [detailRes, ratioRes] = await Promise.all([
      fetchEtfDetails(id),
      fetchEtfRatio(id),
    ]);
    setShowPie(ratioRes.hasRecalculated);
    setEtfResponse(detailRes);
    setEtfIntro(detailRes.EtfIntro);
    setEtfDetail(detailRes.EtfDetail);

    setChartData(toEtfRatioData(ratioRes));
    setRatioInfo(ratioRes.data);
    setIsLoading(false);
  };
  useEffect(() => {
    if (etfIntro) {
      setHeader(etfIntro.issueName, etfIntro.category);
    }
  }, [etfIntro]);

  const [chartData, setChartData] = useState<EtfRatioData>(emptyRatioData);
  const [ratioInfo, setRatioInfo] = useState<RatioInfo[]>(emptyRatioInfo);

  useEffect(() => {
    // setHeader(etf.categoryId, '당신의 투자 성향에 맞는 테마');
    loadDetailAndRatio(etfCode);
  }, []);

  const periodDays = [7, 30, 90, 365, 1095];
  const firstTs = new Date(chartRows[0].date).getTime();
  const lastTs = new Date(chartRows[chartRows.length - 1].date).getTime();
  const diffDays = Math.floor((lastTs - firstTs) / 86400000);

  const lastFitIdx = periodDays.findLastIndex((d) => d <= diffDays);
  const allowedMaxIdx = Math.min(lastFitIdx + 1, 4);
  const canUse = (idx: number) => idx <= allowedMaxIdx;

  const [selectedTab, setSelectedTab] = useState(0);
  // const [selectedPeriod, setSelectedPeriod] = useState(() => {
  //   const firstTs = new Date(initialChart[0].date).getTime();
  //   const lastTs = new Date(
  //     initialChart[initialChart.length - 1].date
  //   ).getTime();
  //   const diffDays = Math.floor((lastTs - firstTs) / 86400000);
  //
  //   const lastFitIdx = periodDays.findLastIndex((d) => d <= diffDays);
  //   const maxIdx = Math.min(lastFitIdx + 1, 4);
  //   return maxIdx;
  // });

  const [selectedPeriod, setSelectedPeriod] = useState(3);

  const [showSelected, setShowSelected] = useState(selectedPeriod);
  const [chartReady, setChartReady] = useState(false);

  if (isLoading) {
    return <Loading text={'ETF 정보를 불러오는 중입니다.'} />;
  }
  if (!etfResponse || !etfIntro || !etfDetail)
    return <div>해당 ETF가 존재하지 않습니다.</div>;
  const periods = ['1주일', '1개월', '3개월', '1년', '3년'];
  const tabs = ['기본정보', '구성 비중'];

  const clickTab = (idx: number) => {
    if (canUse(idx)) {
      setShowSelected(idx);
      setSelectedPeriod(idx);
    } else {
      setShowSelected(idx);
    }
  };
  return (
    <>
      <div className='p-6 flex flex-col items-center gap-5 w-full'>
        <div className='flex flex-col gap-5 w-full'>
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-semibold'>{etfIntro.category}</p>
            <div>
              <span className='text-xl font-bold mr-2'>
                {etfIntro.issueName}
              </span>
              <span className='text-sm text-gray-500 mb-4'>
                {etfIntro.issueCode}
              </span>
            </div>
          </div>
          <div className='flex items-end'>
            <span className='text-xl font-bold mr-2 leading-none'>
              {formatComma(etfIntro.todayClose)}
            </span>
            {parseFloat(etfIntro.flucRate) !== 0 && (
              <ArrowCross
                direction={`${parseFloat(etfIntro.flucRate) > 0 ? 'up' : 'down'}`}
              />
            )}
            <span
              className={`text-xs leading-none ${parseFloat(etfIntro.flucRate) > 0 ? 'text-hana-red' : parseFloat(etfIntro.flucRate) === 0 ? 'text-gray-500' : 'text-blue'}`}
            >
              {parseFloat(etfIntro.flucRate) > 0
                ? `+${parseFloat(etfIntro.flucRate)} %`
                : `${parseFloat(etfIntro.flucRate)} %`}
            </span>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <div className='flex items-center gap-1'>
              <div className=''>
                <p>iNAV</p>
                <p>{formatComma(etfIntro.iNav)}</p>
              </div>
            </div>
            <div className='text-end'>
              <p>거래량</p>
              <p>{formatComma(etfIntro.tradeVolume)}주</p>
            </div>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          {periods.map((label, idx) => (
            <Tab
              key={idx}
              text={label}
              active={showSelected === idx}
              rounded={false}
              onClick={() => {
                clickTab(idx);
              }}
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
              chartRows={chartRows}
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
        {selectedTab === 0 && <EtfDetailTable etf={etfDetail} />}
        {selectedTab === 1 && (
          <EtfDetailRatioChart
            labels={chartData.labels}
            series={chartData.series}
            ratioInfoList={ratioInfo}
            showPie={showPie}
          />
        )}
      </div>
    </>
  );
}
