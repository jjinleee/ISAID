'use client';

import ArrowIcon from '@/public/images/arrow-icon';
import { CircleAlert, X } from 'lucide-react';
import Button from '@/components/button';
import { RewardProps } from './main-page-container';

export default function AgreeModal({
  onClose,
  btnClick,
  detailClick,
  reasons,
}: {
  onClose: () => void;
  btnClick: () => void;
  detailClick: () => void;
  reasons: RewardProps[];
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
          <h1 className='font-semibold text-lg'>
            챌린지 진행을 위해
            <br />
            아래 항목에 대한 동의가 필요합니다.
          </h1>
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
                    <div className='text-xs flex justify-end mt-4'>
                      약관 상세 보기
                      <ArrowIcon
                        direction='bottom'
                        className='w-5 h-5 text-gray-400'
                        viewBox={'-10 -5 28 28'}
                      />
                      {/*<ArrowIcon*/}
                      {/*  direction='top'*/}
                      {/*  className='w-5 h-5 text-gray-400'*/}
                      {/*  viewBox={'-10 5 28 28'}*/}
                      {/*/>*/}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-2'>
              <Button
                thin={false}
                text={'동의하기'}
                onClick={btnClick}
                active={true}
              />
              <Button
                thin={false}
                text={'나중에 할게요'}
                onClick={onClose}
                active={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
