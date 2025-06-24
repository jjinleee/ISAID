'use client';

import Image from 'next/image';
import { iconList } from '../data/challenge-list';

interface MissionItemProps {
  title: string;
  description: string;
  reward: string;
  status: 'completed' | 'available' | 'pending';
  icon: string;
}

interface ChallengeProps {
  id: string;
  issueName: string;
  title: string;
  challengeDescription: string;
  quantity: number;
  status: string;
}

export function MissionItem({
  title,
  description,
  reward,
  status,
  icon,
}: MissionItemProps) {
  const statusLabel = {
    completed: '받기 완료',
    available: '받기',
    pending: '미달성',
  };

  const statusStyle = {
    completed: 'bg-subtitle text-white',
    available: 'bg-primary text-white',
    pending: 'bg-primary-2 text-subtitle',
  };

  const rewardMatch = reward.match(/^(.+?)(\s\d+[\.\d]*[주%].*)$/);

  return (
    <div className='flex items-center gap-4 border border-gray-3 rounded-xl p-4 bg-white shadow-sm'>
      <Image src={icon} alt={title} width={36} height={36} />
      <div className='flex-1'>
        <div className='text-xs font-bold'>{title}</div>
        <div className='text-[8px] text-gray-500'>{description}</div>

        {rewardMatch ? (
          <div className='text-[11px] mt-1'>
            <span className='text-primary font-medium'>{rewardMatch[1]}</span>
            <span className='text-black'>{rewardMatch[2]}</span>{' '}
            <span>지급!</span>
          </div>
        ) : (
          <div className='text-[11px] text-primary mt-1'>{reward}</div>
        )}
      </div>
      <button
        className={`min-w-[64px] text-xs px-2 py-1 rounded-md h-fit text-center ${statusStyle[status]}`}
        disabled={status !== 'available'}
      >
        {statusLabel[status]}
      </button>
    </div>
  );
}
