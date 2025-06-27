'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useParams, useSearchParams } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import { fetchTitle } from '@/utils/guide';
import { convertToKorLabel } from '@/utils/my-page';
import { InvestType } from '@prisma/client';
import VideoPreview from '@/components/guide/video-preview';
import { shortVideos, VideoItem } from '../../../data/video-data';

interface Props {
  session?: Session | null;
}

export const ShortsViewerContainer = ({ session }: Props) => {
  const { setHeader } = useHeader();
  const [filteredVideo, setFilteredVideo] = useState<VideoItem[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');
  const params = useParams();

  const raw = params['category'];
  const category = Array.isArray(raw) ? (raw[0] as string) : (raw as string);
  const searchParams = useSearchParams();
  const investType = searchParams.get('investType') ?? undefined;

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

    // 페이지 제목
    if (session?.user.name != null && investType) {
      setPageTitle(fetchTitle(session?.user.name, investType));
    } else {
      if (category === 'hana') {
        setPageTitle('투자 꿀팁? 하나면 충분!');
      } else {
        setPageTitle('숏츠 가이드');
      }
    }
  }, [category, investType]);

  useEffect(() => {}, []);

  return (
    <div className='flex flex-col py-5 px-4 gap-5'>
      <h2 className='text-lg font-semibold'>{pageTitle}</h2>
      <div className='grid grid-cols-3 gap-4'>
        {filteredVideo.map(({ id, title, duration, views, videoUrl }) => (
          <VideoPreview
            key={id}
            id={id}
            title={title}
            duration={duration}
            views={views}
            videoUrl={videoUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ShortsViewerContainer;
