import type { CircleProps } from '@/types/components.ts';
import { clsx } from 'clsx';

export const CircleCheck = ({ className = '' }: CircleProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={clsx(className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.125 9.75L10.6219 15L7.875 12.375"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
