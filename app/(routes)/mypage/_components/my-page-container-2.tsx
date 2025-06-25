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
import { CircleAlert, TrendingUp } from 'lucide-react';
import ProgressBar from '@/components/progress-bar';
import Tab from '@/components/tab';
import { fetchISAInfo } from '@/lib/api/my-page';
import EtfDetailRatioChart from '../_components/ratio-chart';
import type { EtfInfo } from '../data/ratio-data';

interface Props {
  session: Session;
}

export const MyPageContainer2 = ({ session }: Props) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [connected, setConnected] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [etfDetailList, setEtfDetailList] = useState<EtfInfo[]>([]);
  const [noEtfData, setNoEtfData] = useState(false);
  const [investLabel, setInvestLabel] = useState('');
  const [loadingLabel, setLoadingLabel] = useState<boolean>(true);
  const [traits, setTraits] = useState<string[]>([]);
  const [hashTags, setHashTags] = useState<string[]>([]);
  const [isTested, setIsTested] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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
        if (data.investType === null) {
          setIsTested(false);
          setLoading(false);
          return;
        }
        setIsTested(true);
        setLoading(false);
        setInvestLabel(convertToKorLabel(data.investType));
        setLoadingLabel(false);
        const mbtiInfo =
          riskTypeTraitsMap[
            convertToKorLabel(data.investType) as keyof typeof riskTypeTraitsMap
          ];
        setTraits(mbtiInfo.traits);
        setHashTags(mbtiInfo.hashtags);
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
    <div className='w-full pb-10 px-7 flex flex-col gap-7'>
      <div className='border border-gray-2 rounded-2xl w-full flex flex-col justify-center relative pb-14 px-9 pt-9'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-3'>
            <div
              className='border-2 border-primary rounded-full p-2 w-21 h-21 overflow-hidden flex items-center justify-center
            bg-white
            '
            >
              <StarBoy
                viewBox={'0 0 68 100'}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='flex flex-col gap-2 py-2'>
              <span className='text-xl font-semibold'>
                {session.user.name} 님
              </span>
              {!loading && isTested && (
                <div className='py-1 px-2 text-center bg-primary-2 text-primary rounded-2xl'>
                  {!loadingLabel ? (
                    <h1 className='font-semibold text-hana-green'>
                      {investLabel || '투자성향 테스트를 진행해주세요.'}
                    </h1>
                  ) : (
                    <h1 className='font-semibold text-transparent'>
                      안보이지롱
                    </h1>
                  )}
                </div>
              )}
            </div>
          </div>
          {!loading &&
            (isTested ? (
              <>
                <div className='flex flex-col gap-2'>
                  <div className='font-semibold flex gap-2 text-sm items-center'>
                    <TrendingUp className='text-primary' /> 나의 투자 성향
                  </div>
                  <div className='flex flex-col gap-1 pl-3 text-sm text-gray list-none'>
                    {traits.map((t, idx) => (
                      <div key={idx} className='flex items-start gap-2'>
                        <div className='w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-2' />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  {hashTags.map((h, idx) => (
                    <div
                      key={idx}
                      className='text-xs bg-primary-2 border border-primary text-hana-green py-1 px-3 rounded-xl'
                    >
                      {h}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='flex flex-col gap-3 border border-primary-2 rounded-xl p-4 items-center'>
                <div className='text-primary'>
                  <CircleAlert />
                </div>
                <span className='font-semibold text-gray text-center'>
                  아직 투자 성향 테스트를 진행하지 않으셨네요.
                </span>
                <button
                  onClick={() => router.push('/etf/test')}
                  className='text-xs px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark cursor-pointer transition'
                >
                  테스트 하러 가기
                </button>
              </div>
            ))}
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
              <h1 className='text-xl font-semibold'>내 ETF</h1>
              <div className='border-gray-2 rounded-2xl w-full flex flex-col gap-5 px-5 pt-4 pb-9 items-center'>
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
                selectedId={selectedItem}
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
export default MyPageContainer2;
