'use client';

import { useEffect, useRef, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { Bookmark, Heart, Share, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareSheet from './share-sheet';

interface VideoData {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  likes: number;
  author: string;
  videoUrl: string;
  tags: string[];
}

interface ShortsViewerProps {
  video: VideoData;
}

export default function ShortsViewer({ video }: ShortsViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const { setHeader } = useHeader();
  console.log('video : ', video);
  useEffect(() => {
    if (video) {
      setHeader('숏츠 가이드', video.title);
    }
  }, [video]);

  const getYoutubeId = (url: string): string | null => {
    try {
      const parsed = new URL(url);

      // youtube.com 도메인 처리
      if (parsed.hostname.includes('youtube.com')) {
        if (parsed.pathname.startsWith('/shorts/')) {
          return parsed.pathname.split('/shorts/')[1];
        }
        if (parsed.pathname.startsWith('/embed/')) {
          return parsed.pathname.split('/embed/')[1];
        }
        if (parsed.searchParams.get('v')) {
          return parsed.searchParams.get('v');
        }
      }

      // youtu.be 도메인 처리
      if (parsed.hostname === 'youtu.be') {
        return parsed.pathname.slice(1);
      }

      return null;
    } catch {
      return null;
    }
  };
  const videoId = getYoutubeId(video.videoUrl);
  useEffect(() => {
    if (!iframeRef.current || !videoId) return;

    const message = JSON.stringify({
      event: 'command',
      func: isMuted ? 'mute' : 'unMute',
      args: [],
    });

    iframeRef.current.contentWindow?.postMessage(message, '*');
  }, [isMuted, videoId]);

  if (!videoId) {
    return <p className='text-white p-4'>유효하지 않은 영상 링크입니다.</p>;
  }

  return (
    <div className='bg-black'>
      {/* 영상 */}
      <div
        className='relative flex items-center justify-center'
        style={{ height: 'calc(100vh - 134px)' }}
      >
        <div className='overflow-hidden w-full h-full flex justify-center items-center'>
          <div className='relative w-full max-w-sm aspect-[9/16] overflow-hidden h-full max-h-full'>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
              className='absolute inset-0 w-full h-full'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />

            {/* 사용자 정보 및 제목, 설명 */}
            <div className='absolute bottom-0 left-0 p-4 w-3/4 z-10'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>
                    {video.author[0]}
                  </span>
                </div>
                <span className='text-white text-sm font-medium'>
                  {video.author}
                </span>
              </div>
              <h3 className='text-white font-bold text-lg mb-1'>
                {video.title}
              </h3>
              <p className='text-white/80 text-sm mb-2'>{video.description}</p>
              <div className='flex items-center gap-4 text-white/60 text-xs'>
                <span>조회수 {video.views}</span>
                <span>•</span>
                <span>{video.duration}</span>
              </div>
              <div className='flex flex-wrap gap-1 mt-2'>
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='bg-white/20 text-white text-xs px-2 py-1 rounded-full'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className='absolute bottom-0 right-0 p-4 z-10 flex flex-col items-center gap-4'>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20 flex-col h-auto p-2'
                onClick={() => setLiked((prev) => !prev)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    liked ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span className='text-xs mt-1'>
                  {liked ? video.likes + 1 : video.likes}
                </span>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20 flex-col h-auto p-2'
                onClick={() => setBookmarked((prev) => !prev)}
              >
                <Bookmark
                  className={`h-6 w-6 ${
                    bookmarked ? 'fill-yellow-500 text-yellow-500' : ''
                  }`}
                />
                <span className='text-xs mt-1'>저장</span>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20 flex-col h-auto p-2'
                onClick={() => setShareVisible(true)}
              >
                <Share className='h-6 w-6' />
                <span className='text-xs mt-1'>공유</span>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20'
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className='h-6 w-6' />
                ) : (
                  <Volume2 className='h-6 w-6' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        videoUrl={video.videoUrl}
      />
    </div>
  );
}
