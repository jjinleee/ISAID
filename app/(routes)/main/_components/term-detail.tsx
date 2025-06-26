'use client';

import { useState } from 'react';
import ArrowIcon from '@/public/images/arrow-icon';
import { CircleAlert } from 'lucide-react';
import { RewardProps } from './main-page-container';

interface TermProps extends RewardProps {
  onOpen: () => void;
}

export const TermDetail = ({
  title,
  description,
  detail,
  onOpen,
}: TermProps) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const handleDetailOpen = () => {
    setDetailOpen(!detailOpen);
    onOpen();
  };
  return (
    <div className='flex flex-col gap-3 px-4 pt-4 pb-2 rounded-lg bg-[#f9fbfc] border border-gray-200'>
      <div className='flex gap-3'>
        <CircleAlert className='w-6 h-6 text-primary mt-[2px] flex-shrink-0' />
        <div>
          <p className='font-semibold text-sm text-gray'>{title}</p>
          <p className='text-sm text-gray-700 mt-1'>{description}</p>
          <div
            className='text-xs flex justify-end mt-4'
            onClick={() => handleDetailOpen()}
          >
            약관 상세 보기
            {!detailOpen ? (
              <ArrowIcon
                direction='bottom'
                className='w-5 h-5 text-gray-400'
                viewBox={'-10 -5 28 28'}
              />
            ) : (
              <ArrowIcon
                direction='top'
                className='w-5 h-5 text-gray-400'
                viewBox={'-5 5 28 28'}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={`
      flex flex-col gap-1 text-sm text-gray list-none
      overflow-hidden transition-all duration-300
      ${detailOpen ? 'max-h-96' : 'max-h-0'}
    `}
      >
        {detail.map((d, idx) => (
          <div key={idx} className='flex items-start gap-2'>
            <div className='w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-2' />
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};
