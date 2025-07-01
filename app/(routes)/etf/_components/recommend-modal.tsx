'use client';

import { ReasonProps } from '@/types/etf';
import { CircleAlert, X } from 'lucide-react';
import Button from '@/components/button';

export default function RecommendModal({
  onClose,
  btnClick,
  reasons,
  issueName,
}: {
  onClose: () => void;
  btnClick: () => void;
  reasons: ReasonProps[];
  issueName: string;
}) {
  return (
    <div
      className='fixed inset-0 z-52 flex items-center justify-center overflow-hidden'
      onClick={onClose}
    >
      <div className='absolute inset-0 bg-black opacity-50' />
      <div
        className='relative bg-white rounded-2xl w-[90%] max-w-md z-10 max-h-[80vh] overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='sticky top-0 bg-white p-6 border-b border-gray-200 z-20'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
          >
            <X className='w-5 h-5' />
          </button>
          <h1 className='font-semibold text-xl'>이래서 추천드려요!</h1>
          <h2 className='font-semibold text-md'>{issueName}</h2>
        </div>
        <div className='p-5 overflow-y-auto max-h-[calc(80vh-100px)] overscroll-contain scrollbar-hide'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              {reasons.map(({ title, description }, idx) => (
                <div
                  key={idx}
                  className='flex items-start gap-3 p-4 rounded-lg bg-[#f9fbfc] border border-gray-200'
                >
                  <CircleAlert className='w-6 h-6 text-green-600 mt-[2px] flex-shrink-0' />
                  <div>
                    <p className='font-semibold text-sm text-gray-900'>
                      {title}
                    </p>
                    <p className='text-sm text-gray-700 mt-1'>{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              thin={false}
              text={'ETF 상세 정보 보기'}
              onClick={btnClick}
              active={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
