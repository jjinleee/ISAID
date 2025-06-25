'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import ETFInfoSection from '@/app/(routes)/mypage/_components/etf-info-section';
import IsaAccountSection from '@/app/(routes)/mypage/_components/isa-account-section';
import { riskTypeTraitsMap } from '@/app/(routes)/mypage/data/mbti-test';
import ArrowIcon from '@/public/images/arrow-icon';
import StarBoyGirl from '@/public/images/my-page/star-boy-girl.svg';
import StarBoy from '@/public/images/star-boy';
import { ChartData, type Account } from '@/types/my-page';
import { convertToKorLabel } from '@/utils/my-page';
import ProgressBar from '@/components/progress-bar';
import Tab from '@/components/tab';
import { fetchISAInfo } from '@/lib/api/my-page';
import EtfDetailRatioChart from '../_components/ratio-chart';
import type { EtfInfo } from '../data/ratio-data';

interface Props {
  session: Session;
}

export const MyPageContainer = ({ session }: Props) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [connected, setConnected] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [etfDetailList, setEtfDetailList] = useState<EtfInfo[]>([]);
  const [noEtfData, setNoEtfData] = useState(false);
  const [investLabel, setInvestLabel] = useState('');
  const [loadingLabel, setLoadingLabel] = useState<boolean>(true);

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

  const chartData: ChartData[] = etfDetailList.map((etf) => ({
    id: etf.name,
    name: etf.name,
    value: Number((etf.portionOfTotal * 100).toFixed(2)),
  }));

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

        setAccount(res);
      }
    };

    const fetchEtfPortfolio = async () => {
      try {
        const res = await fetch('/api/etf/portfolio');

        if (res.status === 404) {
          setNoEtfData(true); // ISA 계좌가 없을 때
          return;
        }

        const json = await res.json();

        if (!json.data || json.data.length === 0) {
          setNoEtfData(true); // 보유 ETF 없을 때
          return;
        }

        const sorted = json.data.sort(
          (a: any, b: any) => Number(b.totalPurchase) - Number(a.totalPurchase)
        );
        const sortedEtfArray = sorted.map((etf: any) => ({
          id: etf.etfId,
          name: etf.name,
          avgCost: Number(etf.avgCost),
          totalPurchase: Number(etf.totalPurchase),
          returnRate: parseFloat(etf.returnRate.toFixed(4)),
          quantity: etf.quantity,
          portionOfTotal: parseFloat(etf.portionOfTotal.toFixed(4)),
          currentPrice: Number(etf.currentPrice),
        }));

        setEtfDetailList(sortedEtfArray);
      } catch (error) {
        console.error('ETF 포트폴리오 조회 실패:', error);
      }
    };
    const fetchRecommendEtf = async () => {
      try {
        const res = await fetch('/api/etf/mbti', { method: 'GET' });
        const data = await res.json();
        setInvestLabel(convertToKorLabel(data.investType));
        setLoadingLabel(false);
        const gun =
          riskTypeTraitsMap[
            convertToKorLabel(data.investType) as keyof typeof riskTypeTraitsMap
          ];
        console.log(gun);
      } catch (error) {
        console.log('error', error);
        setLoadingLabel(false);
      }
    };

    fetchISA();
    fetchEtfPortfolio();
    fetchRecommendEtf();
  }, []);

  useEffect(() => {
    const foundEtf = etfDetailList.find((etf) => etf.name === selectedItem);
    if (foundEtf) {
      setSelectedEtf(foundEtf);
    } else {
      setSelectedEtf({
        name: '',
        avgCost: 0,
        totalPurchase: 0,
        returnRate: 0,
        quantity: 0,
        portionOfTotal: 0,
        currentPrice: 0,
      });
    }
  }, [selectedItem, etfDetailList]);
  useEffect(() => {
    if (!selectedItem && etfDetailList[0]) {
      setSelectedItem(etfDetailList[0].name);
    }
  }, [etfDetailList]);

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
          {/*<div className='w-full flex flex-col text-sm text-gray'>*/}
          {/*  <ProgressBar current={3} total={10} />*/}
          {/*  <div className='flex justify-between '>*/}
          {/*    <span>Lv2</span>*/}
          {/*    <span>Lv3</span>*/}
          {/*  </div>*/}
          {/*  <div className='flex justify-between font-semibold'>*/}
          {/*    <span>🔍 용어 탐색러</span>*/}
          {/*    <span>📈 초보 투자 이론가</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {!loadingLabel ? (
            <h1 className='font-semibold'>
              {investLabel || '투자성향 테스트를 진행해주세요.'}
            </h1>
          ) : (
            <h1 className='font-semibold text-transparent'>안보이지롱</h1>
          )}

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
          {noEtfData ? (
            <>
              <h1 className='text-xl font-semibold'>ETF 계좌</h1>
              <div className='border border-gray-2 rounded-2xl w-full flex flex-col gap-5 px-5 pt-4 pb-9 items-center'>
                <h1 className='font-semibold self-start'>
                  {session.user.name}님의 보유 ETF 항목이 없습니다.
                </h1>
                <StarBoyGirl />
              </div>
            </>
          ) : (
            <>
              <EtfDetailRatioChart
                data={chartData}
                onClickItem={setSelectedItem}
              />
              {selectedItem && selectedEtf && (
                <ETFInfoSection selectedEtf={selectedEtf} />
              )}
            </>
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
