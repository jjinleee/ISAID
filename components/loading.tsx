import LoadingStars from '@/public/images/loading-stars.svg';
import { LoadingProps } from '@/types/components';

export const Loading = ({ text }: LoadingProps) => {
  return (
    <div className='w-full h-[80vh] flex flex-col justify-center items-center gap-5'>
      <LoadingStars />
      <span className='text-primary text-xl font-semibold'>{text}</span>
    </div>
  );
};
