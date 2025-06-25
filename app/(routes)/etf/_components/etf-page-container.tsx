'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { RecommendSliderWrapper } from '@/app/(routes)/etf/_components/recommend-slider-wrapper';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import StarBoyFinger from '@/public/images/star-boy-finger.svg';
import { EtfCardProps } from '@/types/etf';
import { fetchRecommend } from '@/lib/api/etf';
import { SliderWrapper } from '../_components/slider-wrapper';
import { cards } from './data/etf-category-data';
import { idToCategoryUrl } from './data/etf-category-url-map';
import RecommendModal from './recommend-modal';

interface Props {
  session: Session | null;
}
const ETFPageContainer = ({ session }: Props) => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [selectedETFId, setSelectedETFId] = useState(26);
  const [recommendList, setRecommendList] = useState<EtfCardProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [investType, setInvestType] = useState<string | null>(null);
  const [preferredCategories, setPreferredCategories] = useState<
    { id: string; fullPath: string }[]
  >([]);

  const [isPreferredCategoriesLoaded, setIsPreferredCategoriesLoaded] =
    useState(false);
  const [isRecommendListLoaded, setIsRecommendListLoaded] = useState(false);

  useEffect(() => {
    setHeader('ETF 맞춤 추천', '당신의 투자 성향에 맞는 테마');

    // 투자 성향 및 선호 카테고리 정보 호출
    const fetchEtfTestInfo = async () => {
      try {
        const res = await fetch('/api/etf/mbti', { method: 'GET' });
        if (!res.ok) return;
        const data = await res.json();
        setInvestType(data.investType);
        setPreferredCategories(data.preferredCategories);
        setIsPreferredCategoriesLoaded(true);
      } catch (error) {
        console.error('MBTI 정보 조회 실패:', error);
        setIsPreferredCategoriesLoaded(true);
      }
    };
    const fetchRecommendEtf = async () => {
      try {
        const res = await fetchRecommend();
        setRecommendList(res.data.recommendations);
        setIsRecommendListLoaded(true);
      } catch (error) {
        setIsRecommendListLoaded(true);
      }
    };

    fetchRecommendEtf();
    fetchEtfTestInfo();
  }, []);

  const handleClick = (id: number) => {
    const path = idToCategoryUrl[id];
    if (!path) {
      console.warn(`id ${id}에 대한 경로가 정의되지 않았습니다.`);
      return;
    }
    router.push(`/etf/category/${path}`);
  };

  const clickSelectedETF = () => {
    router.push(`/etf/detail/${recommendList[selectedETFId].etfId}`);
  };

  const clickRecommendETF = (idx: number) => {
    setSelectedETFId(idx);
    setShowModal(true);
  };

  return (
    <div className='flex flex-col px-6 pb-10'>
      <div className='flex flex-col gap-6'>
        {/* 테스트 카드 */}
        <div
          className='flex px-5 py-8 text-white bg-hana-green cursor-pointer
        gap-5 rounded-2xl relative'
          onClick={() => router.push('etf/test')}
        >
          <StarBoyFinger className='flex-none shrink-0' />
          <div className='flex flex-col justify-center gap-2'>
            <h1 className='font-bold text-xl'>ETF, 뭐부터 시작하지?</h1>
            <span>
              {investType
                ? '테스트를 다시 진행하고 성향을 새롭게 확인해보세요'
                : '몇 가지 질문에 답하면, 당신에게 어울리는 테마를 추천해드릴게요'}
            </span>
          </div>
          <div className='flex gap-1 justify-center items-center absolute top-3 right-3'>
            <span>
              {investType ? '테스트 다시 하기 ' : '테스트 하러 가기 '}
            </span>
            <ArrowIcon
              direction='right'
              className='text-white'
              viewBox='0 0 11 28'
            />
          </div>
        </div>
        <div>
          {/* 추천 종목 */}
          {isPreferredCategoriesLoaded &&
          isRecommendListLoaded &&
          preferredCategories.length > 0 &&
          recommendList.length > 0 ? (
            <div className='flex flex-col gap-5'>
              <h1 className='text-xl font-semibold'>
                {session?.user.name}님을 위한 추천 종목
              </h1>
              <RecommendSliderWrapper
                slides={recommendList}
                clickSlide={clickRecommendETF}
              />
            </div>
          ) : !isPreferredCategoriesLoaded || !isRecommendListLoaded ? (
            <div className='w-full h-[188px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center'>
              <div className='w-3/4 h-6 bg-gray-300 rounded mb-2'></div>
            </div>
          ) : null}
          {/* 추천 카테고리 */}
          {isPreferredCategoriesLoaded &&
          isRecommendListLoaded &&
          preferredCategories.length > 0 &&
          recommendList.length > 0 ? (
            <div className='flex flex-col gap-5'>
              <h2 className='text-xl font-semibold'>선호 카테고리</h2>
              <div className='flex flex-col gap-3'>
                {preferredCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className='flex justify-between items-center p-3.5 rounded-2xl bg-white shadow hover:bg-hana-light-green transition-colors duration-200 cursor-pointer group'
                    onClick={() => handleClick(Number(sub.id))}
                  >
                    <span className='text-base font-semibold text-gray-700 group-hover:text-hana-green'>
                      {sub.fullPath}
                    </span>
                    <ArrowIcon
                      direction='right'
                      className='w-5 h-5 text-gray-400 group-hover:text-hana-green transition-transform duration-200 group-hover:translate-x-1'
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : !isPreferredCategoriesLoaded || !isRecommendListLoaded ? (
            <div className='w-full h-[228px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center'>
              <div className='w-3/4 h-6 bg-gray-300 rounded mb-2'></div>
            </div>
          ) : null}
        </div>
        {/* 테마 슬라이더 */}
        <div className='flex flex-col gap-5'>
          <h1 className='text-xl font-semibold'>ETF, 테마부터 시작해볼까요?</h1>
          <SliderWrapper cards={cards} />
        </div>
      </div>
      {showModal && (
        <RecommendModal
          onClose={() => setShowModal(false)}
          btnClick={() => clickSelectedETF()}
          reasons={recommendList[selectedETFId].reasons}
          issueName={recommendList[selectedETFId].issueName}
        />
      )}
    </div>
  );
};

export default ETFPageContainer;
