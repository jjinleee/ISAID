import { SlideCard } from '@/app/(routes)/etf/_components/slide-card';
import { SlideCardProps } from '@/types/components';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';

interface SliderWrapperProps {
  cards: SlideCardProps[];
}

export const SliderWrapper = ({ cards }: SliderWrapperProps) => {
  const router = useRouter();
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
              category={card.category}
              onClick={() => router.push(`/etf/category/${card.category}`)}
            >
              {card.children}
            </SlideCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
