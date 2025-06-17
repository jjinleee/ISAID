'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import ETFInfoSection from '@/app/(routes)/mypage/_components/etf-info-section';
import IsaAccountSection from '@/app/(routes)/mypage/_components/isa-account-section';
import ArrowIcon from '@/public/images/arrow-icon';
import HanaIcon from '@/public/images/bank-icons/hana-icon';
import StarBoyGirl from '@/public/images/my-page/star-boy-girl.svg';
import StarBoy from '@/public/images/star-boy';
import { ChartData } from '@/types/my-page';
import Button from '@/components/button';
import ProgressBar from '@/components/progress-bar';
import Tab from '@/components/tab';
import EtfDetailRatioChart from '../_components/ratio-chart';
import { etfDetailMap } from '../data/ratio-data';
import type { EtfInfo } from '../data/ratio-data';
import DeleteSheet from './delete-sheet';

interface Props {
  session: Session;
}

export const MyPageContainer = ({ session }: Props) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [connected, setConnected] = useState(true);
  const [bankType, setBankType] = useState<string>('하나');
  const [accountName, setAccountName] = useState<string>('하나은행 ISA 계좌');
  const [accountNumber, setAccountNumber] =
    useState<string>('592-910508-29670');
  const [showFramer, setShowFramer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedEtf, setSelectedEtf] = useState<EtfInfo>({
    name: '',
    avgPrice: 0,
    totalPurchase: 0,
    returnRate: 0,
    quantity: 0,
    portionOfTotal: 0,
  });

  const labels = Object.values(etfDetailMap).map((etf) => etf.name);

  const series = Object.values(etfDetailMap).map((etf) =>
    Number((etf.portionOfTotal * 100).toFixed(2))
  );

  const chartData: ChartData[] = Object.entries(etfDetailMap).map(
    ([etfId, etf]) => ({
      id: etfId,
      name: etf.name,
      value: Number((etf.portionOfTotal * 100).toFixed(2)),
    })
  );

  const tabs = ['보유 ETF', '연결 계좌'];
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${bankType} ${accountNumber.replace(/-/g, '')}`
    );
  };

  const deleteClick = () => {
    setShowFramer(true);
  };

  useEffect(() => {
    setSelectedEtf(etfDetailMap[selectedItem]);
  }, [selectedItem]);

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
          <div className='w-full flex justify-end items-center absolute bottom-4 right-3'>
            <span className='font-light text-sm'>내 정보 수정하기 </span>
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
          accountName={accountName}
          accountNumber={accountNumber}
          bankType={bankType}
          userName={String(session.user.name)}
        />
      )}
    </div>
  );
};
export default MyPageContainer;
