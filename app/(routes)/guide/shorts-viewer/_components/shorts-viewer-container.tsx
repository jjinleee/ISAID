'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/header-context'; // adjust the relative path if needed
import VideoPreview from '@/components/guide/video-preview';
import { shortVideos } from '../../data/video-data';

export const ShortsViewerContainer = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('금융 초보가이드', '숏츠 가이드');
  }, []);

  return (
    <div className='flex flex-col py-5 px-4 gap-5'>
      <h2 className='text-lg font-semibold'>숏츠 가이드</h2>
      <div className='grid grid-cols-2 gap-4'>
        {shortVideos.map(({ id, title, duration, views, videoUrl }) => (
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
