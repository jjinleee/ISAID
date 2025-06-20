'use client';

import toast from 'react-hot-toast'; // ✅ 추가
import { useRouter } from 'next/navigation';
import QuizBannerCharater from '@/public/images/quiz-banner-character.svg';
import QUizBannerGift from '@/public/images/quiz-banner-gift.svg';
import { isSameDay } from 'date-fns';

interface Props {
  onComplete: (date: Date) => void;
  streakLabel: string;
  completedDates: Date[];
}

export default function QuizBanner({
  onComplete,
  streakLabel,
  completedDates,
}: Props) {
  const router = useRouter();

  const today = new Date();
  const alreadyCompleted = completedDates.some((d) => isSameDay(d, today));

  const handleClick = () => {
    if (alreadyCompleted) {
      toast.error('이미 오늘 퀴즈를 푸셨어요!');
      return;
    }

    router.push('/quiz');
  };

  return (
    <div className='bg-primary rounded-xl px-4 pb-3 text-white flex items-center gap-3 cursor-pointer'>
      {/* 캐릭터 */}
      <div className='flex-shrink-0'>
        <QuizBannerCharater />
      </div>

      {/* 가운데 텍스트 */}
      <div className='flex-1 min-w-0'>
        <div className='text-lg font-bold whitespace-nowrap py-0.5'>
          오늘의 금융 퀴즈
        </div>
        <div className='text-sm whitespace-nowrap py-0.5'>
          퀴즈를 풀고 포인트를 받아보세요!
        </div>
        <div className='text-xs whitespace-nowrap py-0.5'>{streakLabel}</div>
      </div>

      {/* 오른쪽 텍스트 */}
      <div
        className='bg-white px-2 py-2 mt-25 w-100% rounded-xl text-xs text-right flex-shrink-0 flex'
        onClick={handleClick}
      >
        <QUizBannerGift />
        <div className='text-sm pt-0.5 text-primary'>퀴즈풀기</div>
      </div>
    </div>
  );
}
