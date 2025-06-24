'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecommendSliderWrapper } from '@/app/(routes)/etf/_components/recommend-slider-wrapper';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import {
  SlideImg1,
  SlideImg2,
  SlideImg3,
  SlideImg4,
  SlideImg5,
} from '@/public/images/etf/etf-slide';
import StarBoyFinger from '@/public/images/star-boy-finger.svg';
import { SlideCardProps } from '@/types/components';
import { SliderWrapper } from '../_components/slider-wrapper';
import { etfCardDummyData, EtfCardProps } from '../data/recommend-etf-data';
import { idToCategoryUrl } from './data/etf-category-url-map';
import RecommendModal from './recommend-modal';

const ETFPageContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [selectedETFId, setSelectedETFId] = useState(26);
  const [recommendList, setRecommendList] = useState<EtfCardProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [investType, setInvestType] = useState<string | null>(null);
  const [preferredCategories, setPreferredCategories] = useState<
    { id: string; fullPath: string }[]
  >([]);

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
      } catch (error) {
        console.error('MBTI 정보 조회 실패:', error);
      }
    };

    fetchEtfTestInfo();
  }, []);
  const cards: SlideCardProps[] = [
    {
      id: 1,
      title: '시장 대표 ETF',
      subtitle: '대표 지수에 투자하고 싶다면',
      description: '가장 기본이 되는 지수 ETF 로 시장 흐름을 따라가요',
      category: 'market-core',
      children: <SlideImg1 />,
    },
    {
      id: 2,
      title: '업종별로 골라보는 ETF',
      subtitle: '관심있는 산업에 바로 투자',
      description: '건설부터 IT까지, 다양한 산업별 테마를 모았어요',
      category: 'industry',
      children: <SlideImg2 />,
    },
    {
      id: 3,
      title: '전략형 ETF',
      subtitle: '성장? 배당? 당신의 전략은?',
      description: '가치, 성장, 배당... 투자 성향에 따라 전략을 골라보세요.',
      category: 'strategy',
      children: <SlideImg3 />,
    },
    {
      id: 4,
      title: '규모 기반 ETF',
      subtitle: '대형주? 중형주? 내가 고르는 사이즈',
      description: '안정적인 대형주부터 잠재력 있는 중형주까지.',
      category: 'market-cap',
      children: <SlideImg4 />,
    },
    {
      id: 5,
      title: '혼합 자산 ETF',
      subtitle: '주식도 채권도 놓치기 싫다면',
      description: '리스크는 낮추고 수익은 챙기는 균형형 포트폴리오',
      category: 'mixed-assets',
      children: <SlideImg5 />,
    },
  ];

  const handleClick = (id: number) => {
    const path = idToCategoryUrl[id];
    if (!path) {
      console.warn(`id ${id}에 대한 경로가 정의되지 않았습니다.`);
      return;
    }
    router.push(`/etf/category/${path}`);
  };

  const clickSelectedETF = () => {
    router.push(`/etf/detail/${selectedETFId}`);
  };

  const clickRecommendETF = (idx: number) => {
    setSelectedETFId(idx);
    setShowModal(true);
  };

  useEffect(() => {
    setRecommendList(etfCardDummyData);
  }, []);

  return (
    <div className='flex flex-col px-6 pb-10'>
      <div className='flex flex-col gap-5'>
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
        {/* 추천 카테고리 */}
        {preferredCategories.length > 0 && (
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
        )}
        {/* 테마 슬라이더 */}
        <h1 className='text-xl font-semibold'>ETF, 테마부터 시작해볼까요?</h1>
        <SliderWrapper cards={cards} />
        <RecommendSliderWrapper
          slides={recommendList}
          clickSlide={clickRecommendETF}
        />
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
