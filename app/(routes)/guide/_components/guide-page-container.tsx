'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import { fetchTitle } from '@/utils/guide';
import { BookOpen, Shield, ShoppingBasket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { shortVideos, VideoItem } from '../data/video-data';
import { SliderWrapper } from './slider-wrapper';

interface Props {
  session: Session;
}

export default function GuidePageContainer({ session }: Props) {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [hanaVideo, setHanaVideo] = useState<VideoItem[]>([]);
  const [recommendVideo, setRecommendVideo] = useState<VideoItem[]>([]);
  const [investType, setInvestType] = useState();
  const [recommendTitle, setRecommendTitle] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchEtfTestInfo = async () => {
      try {
        const res = await fetch('/api/etf/mbti', { method: 'GET' });
        if (!res.ok) return;
        const data = await res.json();
        setInvestType(data.investType);
      } catch (error) {
        console.error('MBTI 정보 조회 실패:', error);
      }
    };
    fetchEtfTestInfo();

    setHeader('금융 초보가이드', '쉽고 재미있게 배우는 투자');
    if (session?.user.name) {
      setUserName(session.user.name);
    }
  }, []);

  useEffect(() => {
    if (investType === undefined) return;

    const filteredHana = shortVideos.filter(
      (video) => video.category === 'hana'
    );
    setHanaVideo(filteredHana);

    if (investType) {
      const filteredRecommend = shortVideos.filter(
        (video) =>
          video.category === 'recommend' && video.investType === investType
      );
      setRecommendVideo(filteredRecommend);
      setRecommendTitle(fetchTitle(userName, investType));
    } else {
      const recommendPool = shortVideos.filter(
        (video) => video.category === 'recommend'
      );

      const randomIds = new Set<number>();
      while (randomIds.size < 6) {
        randomIds.add(Math.floor(Math.random() * 29) + 8);
      }

      let filteredRecommend = recommendPool.filter((video) =>
        randomIds.has(Number(video.id))
      );

      if (filteredRecommend.length < 6) {
        const shuffled = [...recommendPool].sort(() => 0.5 - Math.random());
        filteredRecommend = shuffled.slice(0, 6);
      }

      setRecommendVideo(filteredRecommend);
      setRecommendTitle('추천 가이드');
    }
  }, [investType]);

  const guideCategories = [
    {
      title: '투자 기초',
      icon: BookOpen,
      color: 'bg-primary',
      guides: ['주식이란?', 'ETF 기초', '리스크 관리'],
    },
    {
      title: '절세 전략',
      icon: Shield,
      color: 'bg-blue',
      guides: ['ISA 활용법', '연금저축', '세액공제'],
    },
    {
      title: '상품 비교',
      icon: ShoppingBasket,
      color: 'bg-[#FFD54F]',
      guides: ['ETF vs 펀드', '적금 vs 투자', '보험 상품'],
    },
  ];

  const moreRecommend = () => {
    const base = '/guide/shorts-viewer/recommend';
    if (investType) {
      router.push(`${base}?investType=${encodeURIComponent(investType)}`);
    } else {
      router.push(base);
    }
  };

  return (
    <div className='px-4 py-4'>
      <div className='flex flex-col gap-5'>
        <h2 className='text-xl font-semibold'>카테고리별 가이드</h2>
        <div className='space-y-3'>
          {guideCategories.map((category, index) => (
            <Card
              key={index}
              className='hover:shadow-md transition-shadow cursor-pointer'
              onClick={() => router.push('/guide/category/' + category.title)}
            >
              <CardContent className='p-4'>
                <div className='flex items-start gap-4'>
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className='h-8 w-8 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      {category.title}
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {category.guides.map((guide, guideIndex) => (
                        <div
                          key={guideIndex}
                          className='text-xs border border-gray-2 p-1 rounded-md'
                        >
                          {guide}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>투자 꿀팁? 하나면 충분!</h2>
          <div
            className='flex items-end'
            onClick={() => router.push('/guide/shorts-viewer/hana')}
          >
            <span>더 보기</span>
            <ArrowIcon
              direction='right'
              className='text-black'
              viewBox='0 0 12 36'
            />
          </div>
        </div>
        <div>
          <SliderWrapper videos={hanaVideo.slice(0, 6)} />
        </div>
        <div className='flex items-center justify-between min-w-0'>
          <h2 className='flex-1 text-lg font-semibold truncate pr-2'>
            {recommendTitle}
          </h2>
          <div
            className='flex items-end flex-shrink-0 whitespace-nowrap cursor-pointer'
            onClick={() => moreRecommend()}
          >
            <span>더 보기</span>
            <ArrowIcon
              direction='right'
              className='text-black'
              viewBox='0 0 12 36'
            />
          </div>
        </div>
        <div>
          {recommendVideo.length === 0 ? (
            <p className='text-sm text-gray-500'>추천 영상이 없습니다.</p>
          ) : (
            <SliderWrapper
              videos={recommendVideo.slice(0, 6)}
              investType={investType}
            />
          )}
        </div>
      </div>
    </div>
  );
}
