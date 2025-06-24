'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecommendSliderWrapper } from '@/app/(routes)/etf/_components/recommend-slider-wrapper';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import { ETFArrow } from '@/public/images/etf/etf-rate';
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
import RecommendModal from './recommend-modal';

const ETFPageContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [selectedETFId, setSelectedETFId] = useState(26);
  const [recommendList, setRecommendList] = useState<EtfCardProps[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setHeader('ETF 맞춤 추천', '당신의 투자 성향에 맞는 테마');
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

  const etfItems = [
    { name: 'SCHD', rate: -8.23 },

    { name: 'GUN', rate: 5.23 },
  ];

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
        <div
          className='flex px-5 py-8 text-white bg-hana-green cursor-pointer
        gap-5 rounded-2xl relative'
          onClick={() => router.push('etf/test')}
        >
          <StarBoyFinger className='flex-none shrink-0' />
          <div className='flex flex-col justify-center gap-2'>
            <h1 className='font-bold text-xl'>ETF, 뭐부터 시작하지?</h1>
            <span>
              몇 가지 질문에 답하면, 당신에게 어울리는 테마를 추천해드릴게요
            </span>
          </div>
          <div className='flex gap-1 justify-center items-center absolute top-3 right-3'>
            <span>테스트 하러 가기 </span>
            <ArrowIcon
              direction='right'
              className='text-white'
              viewBox='0 0 11 28'
            />
          </div>
        </div>
        <h1 className='text-xl font-semibold'>ETF, 테마부터 시작해볼까요?</h1>
        <SliderWrapper cards={cards} />
        <RecommendSliderWrapper
          slides={recommendList}
          clickSlide={clickRecommendETF}
        />
        <div className='flex items-center justify-between'>
          <h1 className='font-bold text-xl'>내가 담은 ETF</h1>
          <div className='flex gap-2 justify-center items-center text-sm cursor-pointer'>
            <span className='font-semibold'>전체보기</span>
            <ArrowIcon direction='right' className='w-5 h-5' />
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          {etfItems.map((item, index) => {
            return (
              <div
                key={item.name}
                className='flex justify-between px-3 py-4 font-semibold shadow-md rounded-xl cursor-pointer'
              >
                <span>{item.name}</span>
                <div className='flex gap-1 items-center'>
                  {item.rate > 0 ? (
                    <ETFArrow direction='up' />
                  ) : (
                    <ETFArrow direction='down' />
                  )}
                  <span
                    className={`${item.rate > 0 ? 'text-hana-red' : 'text-[#155DFC]'}`}
                  >
                    {item.rate}%
                  </span>
                </div>
              </div>
            );
          })}
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
