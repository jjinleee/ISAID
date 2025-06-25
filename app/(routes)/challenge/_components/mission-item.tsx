'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface MissionItemProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: 'completed' | 'available' | 'pending';
  icon: string;
}

export function MissionItem({
  id,
  title,
  description,
  reward,
  status, // 초기 상태
  icon,
}: MissionItemProps) {
  // 1) status를 로컬 상태로 복제
  const [currentStatus, setCurrentStatus] =
    useState<MissionItemProps['status']>(status);
  const [isLoading, setIsLoading] = useState(false);

  const statusLabel = {
    completed: '받기 완료',
    available: '받기',
    pending: '미달성',
  } as const;

  const statusStyle = {
    completed: 'bg-subtitle text-white',
    available: 'bg-primary text-white',
    pending: 'bg-primary-2 text-subtitle',
  } as const;

  const rewardMatch = reward.match(/^(.+?)(\s\d+[\.\d]*[주%].*)$/);

  const handleClaim = async () => {
    if (currentStatus !== 'available' || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/challenge/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: id }),
      });

      if (!res.ok) throw new Error('보상 요청에 실패했습니다.');

      // 2) 성공 시 로컬 상태를 completed로 바꿔버리기
      toast.success('보상 수령이 완료되었습니다!');
      setCurrentStatus('completed');
    } catch (error) {
      console.error(error);
      toast.error('보상 수령에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-4 border border-gray-3 rounded-xl p-4 bg-white shadow-sm'>
      <Image src={icon} alt={title} width={36} height={36} />
      <div className='flex-1'>
        <div className='text-sm font-bold'>{title}</div>
        <div className='text-xs text-gray-500'>{description}</div>

        {rewardMatch ? (
          <div className='text-[11px] mt-1'>
            <span className='text-primary font-medium text-xs'>
              {rewardMatch[1]}
            </span>
            <span className='text-black'>{rewardMatch[2]}</span>{' '}
            <span>지급!</span>
          </div>
        ) : (
          <div className='text-xs text-primary mt-1'>{reward}</div>
        )}
      </div>

      <button
        onClick={handleClaim}
        className={`
          min-w-[64px] text-sm font-semibold px-2 py-1 rounded-md h-fit text-center cursor-pointer
          ${statusStyle[currentStatus]}
        `}
        disabled={currentStatus !== 'available' || isLoading}
      >
        {isLoading ? '요청 중...' : statusLabel[currentStatus]}
      </button>
    </div>
  );
}
