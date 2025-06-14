import { SlideCard } from '@/app/(routes)/etf/_components/slide-card';
import { SlideCardProps } from '@/types/components';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface SliderWrapperProps {
  cards: SlideCardProps[];
}

export const SliderWrapper = ({ cards }: SliderWrapperProps) => {
  return (
    <>
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
        {cards.map((card: SlideCardProps) => (
          <SwiperSlide key={card.id} className='!w-[240px] shrink-0 !p-2'>
            <SlideCard
              title={card.title}
              subtitle={card.subtitle}
              description={card.description}
            >
              {card.children}
            </SlideCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
