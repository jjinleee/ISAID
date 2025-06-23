'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import ETFInfoSection from '@/app/(routes)/mypage/_components/etf-info-section';
import IsaAccountSection from '@/app/(routes)/mypage/_components/isa-account-section';
import ArrowIcon from '@/public/images/arrow-icon';
import StarBoy from '@/public/images/star-boy';
import { ChartData, type Account } from '@/types/my-page';
import ProgressBar from '@/components/progress-bar';
import Tab from '@/components/tab';
import { fetchISAInfo } from '@/lib/api/my-page';
import EtfDetailRatioChart from '../_components/ratio-chart';
import type { EtfDetailMap, EtfInfo } from '../data/ratio-data';

interface Props {
  session: Session;
}

export const MyPageContainer = ({ session }: Props) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [connected, setConnected] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [etfDetailMap, setEtfDetailMap] = useState<EtfDetailMap>({});
  const [selectedEtf, setSelectedEtf] = useState<EtfInfo>({
    name: '',
    avgCost: 0,
    totalPurchase: 0,
    returnRate: 0,
    quantity: 0,
    portionOfTotal: 0,
    currentPrice: 0,
  });
  const [account, setAccount] = useState<Account>({
    id: '',
    userId: '',
    bankCode: '하나증권',
    accountNum: '',
    connectedAt: '',
    currentBalance: 0,
    accountType: '',
  });

  const chartData: ChartData[] = Object.entries(etfDetailMap).map(
    ([etfId, etf]) => ({
      id: etfId,
      name: etf.name,
      value: Number((etf.portionOfTotal * 100).toFixed(2)),
    })
  );

  const tabs = ['보유 ETF', '연결 계좌'];

  useEffect(() => {
    const fetchISA = async () => {
      const res = await fetchISAInfo();

      if ('error' in res) {
        if (res.error === 'NOT_FOUND') {
          setConnected(false);
          console.log('ISA 계좌가 없습니다.');
        } else {
          console.log('에러 발생: ', res.status || res.error);
        }
      } else {
        setConnected(true);
        console.log('res : ', res);
        setAccount(res);
      }
    };

    const fetchEtfPortfolio = async () => {
      try {
        const res = await fetch('/api/etf/portfolio');
        const json = await res.json();

        const etfMap: EtfDetailMap = Object.fromEntries(
          json.data.map((etf: any) => [
            etf.etfId,
            {
              name: etf.name,
              avgCost: Number(etf.avgCost),
              totalPurchase: Number(etf.totalPurchase),
              returnRate: parseFloat(etf.returnRate.toFixed(4)),
              quantity: etf.quantity,
              portionOfTotal: parseFloat(etf.portionOfTotal.toFixed(4)),
              currentPrice: Number(etf.currentPrice),
            },
          ])
        );

        setEtfDetailMap(etfMap);
      } catch (error) {
        console.error('ETF 포트폴리오 조회 실패:', error);
      }
    };

    fetchISA();
    fetchEtfPortfolio();
  }, []);

  useEffect(() => {
    console.log('account : ', account);
  }, [account]);

  useEffect(() => {
    setSelectedEtf(etfDetailMap[selectedItem]);
  }, [selectedItem, etfDetailMap]);

  return (
    <div className='w-full pt-24 pb-10 px-7 flex flex-col gap-7'>
      <div className='border border-gray-2 rounded-2xl w-full flex items-center justify-center relative pt-20 px-9 pb-14'>
        <div className='w-full flex flex-col gap-4 items-center'>
          <div className='flex flex-col gap-2 items-center text-xl font-semibold '>
            <div
              className='border-2 border-primary rounded-full p-2 w-32 h-32 overflow-hidden flex items-center justify-center
            absolute top-[-22%] left-50% z-20 bg-white
            '
            >
              <StarBoy
                viewBox={'0 0 68 100'}
                className='w-full h-full object-cover'
              />
            </div>
            <span>{session.user.name} 님</span>
          </div>
          <div className='w-full flex flex-col text-sm text-gray'>
            <ProgressBar current={3} total={10} />
            <div className='flex justify-between '>
              <span>Lv2</span>
              <span>Lv3</span>
            </div>
            <div className='flex justify-between font-semibold'>
              <span>🔍 용어 탐색러</span>
              <span>📈 초보 투자 이론가</span>
            </div>
          </div>
          <h1 className='font-semibold'>ESFP : 자유로운 영혼의 연예인</h1>
          <div
            className='flex justify-end items-center absolute bottom-4 right-3 cursor-pointer'
            onClick={() => router.push('mypage/profile')}
          >
            <span className='font-light text-sm'>
              내 정보 확인 <span className='opacity-50'>/</span> 수정하기
            </span>
            <ArrowIcon
              direction='right'
              color='#c9c9c9'
              className='w-4 h-4'
              viewBox='0 0 11 28'
            />
          </div>
        </div>
      </div>
      <div className='flex justify-between'>
        {tabs.map((tab, idx) => {
          return (
            <Tab
              key={idx}
              text={tab}
              active={selectedTab === idx}
              rounded={false}
              onClick={() => setSelectedTab(idx)}
            />
          );
        })}
      </div>
      {selectedTab === 0 && (
        <div className='w-full flex flex-col gap-5'>
          <EtfDetailRatioChart data={chartData} onClickItem={setSelectedItem} />
          {selectedItem && selectedEtf && (
            <ETFInfoSection selectedEtf={selectedEtf} />
          )}
        </div>
      )}
      {selectedTab === 1 && (
        <IsaAccountSection
          connected={connected}
          userName={String(session.user.name)}
          account={account}
        />
      )}
    </div>
  );
};
export default MyPageContainer;
