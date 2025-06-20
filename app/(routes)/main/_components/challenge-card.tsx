'use client';

import Link from 'next/link';
import HanaChallenge from '@/public/images/hanamoa-challenge.svg';
import { ChevronRight } from 'lucide-react';

export default function ChallengeCard() {
  return (
    <Link
      href='/challenge'
      className='flex justify-between items-center bg-[#FFF6D6] rounded-2xl shadow-sm p-4'
    >
      {/* 좌측 캐릭터 이미지 */}
      <div className='flex items-center gap-4'>
        <HanaChallenge />
        <div>
          <p className='text-lg font-bold text-black'>하나모아 챌린지</p>
          <p className='text-sm text-black'>
            ETF 한조각, 미션 수행하고 받아가세요
          </p>
        </div>
      </div>
      {/* 우측 화살표 */}

      <ChevronRight size={24} className='text-black' />
    </Link>
  );
}
