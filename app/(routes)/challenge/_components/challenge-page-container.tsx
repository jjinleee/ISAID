'use client';

import { useEffect } from 'react';
import { useHeader } from '@/context/header-context';
import ChallengeMainCharaters from '@/public/images/challenge/challenge-main.svg';
import { challengeList } from '../data/challenge-list';
import { MissionItem } from './mission-item';

export default function ChallengePageContainer() {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('하나모아 챌린지', '소소한 미션이 ETF 한조각으로');
  }, []);

  return (
    <div className='w-full mx-auto px-4 py-8'>
      {/* 헤더 영역 */}
      <div className='text-center'>
        <h1 className='text-xl font-bold'>하나모아 챌린지</h1>
        <h1 className='text-xl font-bold'>
          챌린지 달성하면{' '}
          <span className='text-primary font-bold'>ETF 조각</span> 증정!
        </h1>
      </div>
      <div className='w-full flex justify-center pb-8'>
        <ChallengeMainCharaters />
      </div>

      {/* 미션 리스트 */}
      <div className='space-y-4'>
        {challengeList.map((item) => (
          <MissionItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
