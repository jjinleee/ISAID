'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import { BookOpen, Shield, ShoppingBasket } from 'lucide-react';
import VideoPreview from '@/components/guide/video-preview';
import { Card, CardContent } from '@/components/ui/card';
import { shortVideos } from '../data/video-data';

export default function GuidePageContainer() {
  const { setHeader } = useHeader();
  const router = useRouter();

  useEffect(() => {
    setHeader('금융 초보가이드', '쉽고 재미있게 배우는 투자');
  }, []);

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

  return (
    <div className='px-4 py-8'>
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
          <h2 className='text-lg font-semibold'>숏츠 가이드</h2>
          <div
            className='flex items-end'
            onClick={() => router.push('/guide/shorts-viewer')}
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
          <div className='grid grid-cols-2 gap-3'>
            {shortVideos.slice(0, 4).map((video) => (
              <VideoPreview
                key={video.id}
                id={video.id}
                title={video.title}
                duration={video.duration}
                views={video.views}
                videoUrl={video.videoUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
