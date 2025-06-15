import React from 'react';
import { cn } from '@/lib/utils';

// ex)
// <ArrowIcon direction="right" color="#4C525D" className="w-6 h-6" />
// <ArrowIcon direction="top" className="text-primary" />
// <ArrowIcon direction="bottom" />

interface ArrowIconProps {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  className?: string;
  viewBox?: string;
}

const rotationMap = {
  left: 'rotate-0',
  right: 'rotate-180',
  top: 'rotate-90',
  bottom: '-rotate-90',
};

export const ArrowIcon = ({
  direction = 'left',
  color = 'currentColor',
  className,
  viewBox,
}: ArrowIconProps) => {
  const rotationClass = rotationMap[direction];

  return (
    <svg
      width='28'
      height='28'
      viewBox={viewBox || '0 0 28 28'}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('transition-transform', rotationClass, className)}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.9803 14.3074C4.6253 16.9608 7.2105 19.5499 9.7359 22.0745C9.86808 22.2135 9.9418 22.3979 9.9418 22.5897C9.9418 22.7815 9.86808 22.9659 9.7359 23.1049C9.37825 23.5028 8.81245 23.4683 8.55485 23.1969C5.93745 20.5726 3.1993 17.8298 0.3404 14.9686C0.113467 14.7823 0 14.5623 0 14.3085C0 14.0548 0.113467 13.8278 0.3404 13.6277L8.94585 5.22584C9.11105 5.07426 9.32879 4.99297 9.55291 4.9992C9.77703 5.00542 9.98991 5.09867 10.1464 5.25919C10.5581 5.67204 10.3994 6.07914 10.2131 6.27234C7.46455 8.94704 4.71988 11.6258 1.97915 14.3085'
        fill={color}
      />
    </svg>
  );
};

export default ArrowIcon;
