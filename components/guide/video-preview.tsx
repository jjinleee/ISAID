'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';

export interface VideoPreviewProps {
  id: string;
  title: string;
  duration: string;
  views: string;
  videoUrl: string;
}

const getYoutubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.searchParams.get('v')) {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const VideoPreview = ({
  id,
  title,
  duration,
  views,
  videoUrl,
}: VideoPreviewProps) => {
  const router = useRouter();
  const videoId = getYoutubeVideoId(videoUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/0.jpg`
    : null;
  const handleClick = (id: string) => {
    router.push(`/guide/shorts-viewer/${id}`);
  };

  return (
    <div
      className='border border-gray-200 rounded-xl p-4 flex flex-col items-center w-full'
      onClick={() => handleClick(id)}
    >
      <div className='relative w-full aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden'>
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt='YouTube Thumbnail'
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-6xl'>
            썸네일 없음
          </div>
        )}
        <div className='absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-lg'>
          <Play className='text-white w-10 h-10' />
        </div>
      </div>
      <div className='mt-3 flex flex-col items-start w-full'>
        <span className='font-medium text-sm truncate'>{title}</span>
        <span className='text-xs text-gray-500'>
          {views} • {duration}
        </span>
      </div>
    </div>
  );
};

export default VideoPreview;
