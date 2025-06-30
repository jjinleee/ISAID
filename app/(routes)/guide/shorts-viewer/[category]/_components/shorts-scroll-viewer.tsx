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
  session?: Session | null;
  videos: VideoItem[];
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;

    const atTop = () => el.scrollTop <= 0;
    const atBottom = () =>
      el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    const onWheel = (e: WheelEvent) => {
      if ((e.deltaY < 0 && atTop()) || (e.deltaY > 0 && atBottom())) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      if ((deltaY < 0 && atTop()) || (deltaY > 0 && atBottom())) {
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [filteredVideo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframe = entry.target.querySelector(
            'iframe'
          ) as HTMLIFrameElement;
          if (!iframe?.contentWindow) return;

          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: entry.isIntersecting ? 'playVideo' : 'pauseVideo',
              args: [],
            }),
            '*'
          );

          if (!entry.isIntersecting) {
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'seekTo',
                args: [0, true],
              }),
              '*'
            );
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.9,
      }
    );
    const items = containerRef.current?.querySelectorAll('.video-container');
    items?.forEach((el) => observer.observe(el));

    items?.forEach((el) => {
      const iframe = el.querySelector('iframe') as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'pauseVideo',
            args: [],
          }),
          '*'
        );
      }
    });

    return () => observer.disconnect();
  }, [filteredVideo]);

  return (
    <div
      ref={containerRef}
      className='h-screen overflow-y-scroll snap-y snap-mandatory overscroll-y-contain pb-[150px]'
      style={{ scrollPaddingBottom: '150px' }}
    >
      {filteredVideo.map((video, idx) => (
        <div
          key={video.id}
          className='h-[calc(100vh-150px)] overflow-y-hidden snap-start video-container'
        >
          {/*// <div key={video.id} className='h-screen snap-start'>*/}
          {/*<div key={video.id} className='min-h-screen snap-start'>*/}
          {/*<div className='h-[150px] shrink-0 snap-none aria-hidden:true'></div>*/}

          <iframe
            width='100%'
            height='100%'
            src={`https://www.youtube.com/embed/${video.videoUrl.split('/').pop()?.split('?')[0]}?autoplay=0&mute=1&enablejsapi=1`}
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
