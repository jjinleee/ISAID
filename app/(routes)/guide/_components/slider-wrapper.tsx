import { SlideCardProps } from '@/types/components';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import VideoPreview, {
  VideoPreviewProps,
} from '@/components/guide/video-preview';
import 'swiper/css';
import 'swiper/css/pagination';

interface SliderWrapperProps {
  videos: VideoPreviewProps[];
  investType?: string;
}

export const SliderWrapper = ({ videos, investType }: SliderWrapperProps) => {
  return (
    <>
      <Swiper
        modules={[Pagination]}
        slidesPerView='auto'
        slidesPerGroup={1}
        className='max-w-full !pb-8'
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-dot"></span>`;
          },
        }}
      >
        {videos.map((video: VideoPreviewProps, idx: number) => (
          <SwiperSlide
            key={video.id}
            className='!w-[240px] min-w-0 shrink-0 !p-2'
          >
            <VideoPreview
              key={video.id}
              id={video.id}
              title={video.title}
              duration={video.duration}
              views={video.views}
              videoUrl={video.videoUrl}
              category={video.category}
              investType={investType}
              idx={idx}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
