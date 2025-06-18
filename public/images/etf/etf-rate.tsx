import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface DirectionArrowProps extends HTMLAttributes<SVGSVGElement> {
  direction?: 'up' | 'down';
}

export const ETFArrow = ({
  direction = 'down',
  className,
  ...props
}: DirectionArrowProps) => {
  const isUp = direction === 'up';

  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn(
        'transition-transform duration-200',
        isUp ? 'rotate-180 fill-hana-red' : 'fill-[#155DFC]',
        className
      )}
      {...props}
    >
      <path d='M4.13603 9.00177C4.22393 9.15331 4.3501 9.2791 4.50191 9.36654C4.65372 9.45398 4.82584 9.5 5.00103 9.5C5.17621 9.5 5.34833 9.45398 5.50014 9.36654C5.65195 9.2791 5.77812 9.15331 5.86602 9.00177L9.86603 2.00177C9.95375 1.84983 9.99995 1.67748 10 1.50203C10 1.32658 9.95393 1.1542 9.86628 1.00222C9.77863 0.850226 9.65254 0.723972 9.50067 0.63613C9.34879 0.548289 9.17647 0.501952 9.00103 0.501772L1.00103 0.501772C0.825575 0.501952 0.653261 0.548289 0.501385 0.63613C0.349508 0.723972 0.223416 0.850226 0.135769 1.00222C0.0481219 1.1542 0.00200536 1.32658 0.0020504 1.50203C0.00209544 1.67748 0.0483004 1.84983 0.136025 2.00177L4.13603 9.00177Z' />
    </svg>
  );
};
