'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { TermDetail } from '@/app/(routes)/main/_components/term-detail';
import { X } from 'lucide-react';
import Button from '@/components/button';
import { RewardProps } from './main-page-container';

export default function AgreeModal({
  onClose,
  btnClick,
  reasons,
}: {
  onClose: () => void;
  btnClick: () => void;
  reasons: RewardProps[];
}) {
  const [confirmed, setConfirmed] = useState<boolean[]>(
    new Array(3).fill(false)
  );

  const handleOpen = (idx: number) => {
    setConfirmed((prev) => prev.map((v, i) => (i === idx ? true : v)));
  };
  const allRead = confirmed.every(Boolean);

  const handleAgree = () => {
    if (!allRead) {
      toast.error('모든 약관의 세부 사항을 확인해주세요.');
      return;
    }
    btnClick();
  };

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
              {reasons.map(({ title, description, detail }, idx) => (
                <TermDetail
                  key={idx}
                  detail={detail}
                  title={title}
                  description={description}
                  onOpen={() => handleOpen(idx)}
                />
              ))}
            </div>
            <div className='flex flex-col gap-2'>
              <Button
                thin={false}
                text={'동의하기'}
                onClick={handleAgree}
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
