import { SlideCardProps } from '@/types/components';

export const SlideCard = ({
  title,
  subtitle,
  description,
  children,
}: SlideCardProps) => {
  return (
    <div className='flex flex-col p-5 justify-between shadow-md w-[240px] h-[240px] relative'>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <p className='text-sm'>{description}</p>
        </div>
      </div>
      <div className='flex justify-end absolute bottom-4 right-4'>
        {children}
      </div>
    </div>
  );
};
