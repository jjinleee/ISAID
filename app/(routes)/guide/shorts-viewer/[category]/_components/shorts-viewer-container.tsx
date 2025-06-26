'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import VideoPreview from '@/components/guide/video-preview';
import { shortVideos, VideoItem } from '../../../data/video-data';

export const ShortsViewerContainer = () => {
  const { setHeader } = useHeader();
  const [filteredVideo, setFilteredVideo] = useState<VideoItem[]>([]);
  const params = useParams();

  const raw = params['category'];
  const category = Array.isArray(raw) ? (raw[0] as string) : (raw as string);

  useEffect(() => {
    const filtered = shortVideos.filter((video) => video.category === category);
    setFilteredVideo(filtered);
    if (category === 'hana') {
      setHeader('숏츠 가이드', '하나은행 금융 상식 춋츠');
    } else if (category === 'recomment') {
      setHeader('숏츠 가이드', '맞춤 추천 춋츠');
    }
  }, [category]);

  return (
    <div className='flex flex-col py-5 px-4 gap-5'>
      <h2 className='text-lg font-semibold'>숏츠 가이드</h2>
      <div className='grid grid-cols-2 gap-4'>
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
