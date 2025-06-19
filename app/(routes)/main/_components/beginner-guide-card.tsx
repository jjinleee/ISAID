'use client';

import Link from 'next/link';
import StaryBoyGood from '@/public/images/star-boy-good.svg';
import { BookOpen } from 'lucide-react';

export default function BeginnerGuideCard() {
  return (
    <div className='relative bg-primary-2 p-4 pt-8 pb-6 rounded-2xl overflow-hidden min-h-[110px]'>
      {/* 좌측: 캐릭터 + 텍스트 */}
      <div className='flex items-start gap-4 pr-10 pl-2'>
        {/* 캐릭터 이미지 */}
        <div className='mt-[-8px]'>
          <StaryBoyGood />
        </div>

        {/* 텍스트 */}
        <div>
          <p className='font-bold text-gray text-lg'>금융초보가이드</p>
          <p className='text-gray-4 text-xs'>
            투자가 처음이라면? 쉽고 재미있게 배워보세요!
          </p>
        </div>
      </div>

      {/* 버튼: 오른쪽 하단 고정 */}
      <Link
        href='/guide'
        className='absolute bottom-3 right-4 bg-white px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1 text-sm shadow-sm'
      >
        <BookOpen size={16} />
        보기
      </Link>
    </div>
  );
}
