'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Session } from 'next-auth';
import { useParams, useSearchParams } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import { fetchTitle } from '@/utils/guide';
import { convertToKorLabel } from '@/utils/my-page';
import { InvestType } from '@prisma/client';
import { shortVideos, VideoItem } from '../../../data/video-data';

interface ShortsScrollViewerProps {
  session: Session | null;
  initialIndex?: number;
}

const ShortsScrollViewer: React.FC<ShortsScrollViewerProps> = ({
  session,
  initialIndex = 0,
}) => {
  const { setHeader } = useHeader();
  const [filteredVideo, setFilteredVideo] = useState<VideoItem[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');
  const params = useParams();

  const raw = params['category'];
  const category = Array.isArray(raw) ? (raw[0] as string) : (raw as string);
  const searchParams = useSearchParams();
  const investType = searchParams.get('investType') ?? undefined;

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let filtered: VideoItem[] = [];

    if (category === 'hana') {
      filtered = shortVideos.filter((v) => v.category === 'hana');
      setHeader('숏츠 가이드', '투자 꿀팁? 하나면 충분!');
    } else if (category === 'recommend') {
      if (investType) {
        filtered = shortVideos.filter(
          (v) => v.category === 'recommend' && v.investType === investType
        );
      } else {
        filtered = shortVideos.filter((v) => v.category === 'recommend');
      }
      setHeader(
        '숏츠 가이드',
        investType
          ? `맞춤 추천 숏츠 – ${convertToKorLabel(investType as InvestType)}`
          : '맞춤 추천 숏츠'
      );
    }

    setFilteredVideo(filtered);

    if (session?.user.name != null && investType) {
      setPageTitle(fetchTitle(session?.user.name, investType));
    } else {
      setPageTitle(
        category === 'hana' ? '투자 꿀팁? 하나면 충분!' : '숏츠 가이드'
      );
    }
  }, [category, investType]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: initialIndex * window.innerHeight,
        behavior: 'auto',
      });
    }
  }, [initialIndex, filteredVideo]);

  return (
    <div
      ref={containerRef}
      className='h-screen overflow-y-scroll snap-y snap-mandatory'
    >
      {filteredVideo.map((video) => (
        <div key={video.id} className='h-screen snap-start'>
          <iframe
            width='100%'
            height='100%'
            src={`https://www.youtube.com/embed/${video.videoUrl.split('/').pop()?.split('?')[0]}?autoplay=1&mute=1`}
            title={video.title}
            allow='autoplay; encrypted-media'
            allowFullScreen
            className='w-full h-full'
          />
        </div>
      ))}
    </div>
  );
};

export default ShortsScrollViewer;
