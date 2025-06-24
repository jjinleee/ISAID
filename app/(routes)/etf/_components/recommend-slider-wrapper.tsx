import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { EtfCardProps } from '@/types/etf';
import EtfRecommendCard from './etf-recommend-card';

interface Props {
  slides: EtfCardProps[];
  clickSlide: (idx: number) => void;
}

export const RecommendSliderWrapper = ({ slides, clickSlide }: Props) => {
  const handleClick = (idx: number) => {
    clickSlide(idx);
  };

  return (
    <Swiper
      modules={[Pagination]}
      slidesPerView='auto'
      slidesPerGroup={1}
      spaceBetween={16}
      className='max-w-full !pb-8'
      pagination={{
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class="${className} custom-dot"></span>`;
        },
      }}
    >
      {slides.map((item, idx) => (
        <SwiperSlide key={idx} className='!w-[240px] shrink-0 !p-2'>
          <EtfRecommendCard
            riskGrade={item.riskGrade}
            issueName={`${item.issueName}`}
            flucRate={item.flucRate}
            onClick={() => handleClick(idx)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
