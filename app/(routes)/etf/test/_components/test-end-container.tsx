'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StayBoyTest from '@/public/images/star-boy-test.svg';
import Button from '@/components/button';
import { getRecommendedTypesWithReasons, getRiskType } from '@/lib/test/utils';

interface TestEndContainerProps {
  answers: (number | null)[];
}

export const TestEndContainer = ({ answers }: TestEndContainerProps) => {
  const router = useRouter(); // useRouter 초기화
  const riskType = getRiskType(answers);
  const recommended = getRecommendedTypesWithReasons(answers); // 상위 3개 분류체계

  // ETF 페이지 이동 로직
  const handleBtnClick = () => {
    router.push('/etf'); // '/etf' 경로로 이동
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='w-full flex flex-col items-center gap-10 px-6'>
      <h1 className='text-3xl font-bold text-center'>
        ETF 투자 성향 테스트 결과
      </h1>
      <span className='text-xl text-center text-subtitle'>
        당신은 <strong className='text-primary text-2xl'>{riskType}</strong>{' '}
        투자 성향이에요!
      </span>

      <StayBoyTest />

      <div className='flex flex-col gap-8 mt-8 w-full max-w-xl'>
        {recommended.map((item) => (
          <div key={item.name} className='p-6 rounded-xl shadow-lg bg-white'>
            {/* 분류체계 이름 */}
            <div className='text-sm text-gray-500 font-mono mb-1'>
              [{item.name}]
            </div>

            {/* 임팩트 문구 */}
            <div className='text-xl font-semibold text-primary'>
              {item.impact}
            </div>

            {/* 줄바꿈 된 추천 이유 목록 */}
            <div className='text-base mt-3 text-gray-800'>
              {item.reason.map((line, idx) => (
                <p key={idx}>• {line}</p>
              ))}
            </div>

            {/* 설명 */}
            <div className='text-base mt-4 text-gray-900 leading-relaxed'>
              {item.description}
            </div>

            {/* 해시태그 */}
            <div className='flex flex-wrap gap-2 mt-4'>
              {item.hashtags.map((tag) => (
                <span
                  key={tag}
                  className='text-sm px-3 py-1 bg-gray-100 rounded-full'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        text='ETF 보러가기'
        thin={false}
        active={true}
        onClick={handleBtnClick}
        className='text-lg px-6 py-3 mt-8'
      />
    </div>
  );
};
