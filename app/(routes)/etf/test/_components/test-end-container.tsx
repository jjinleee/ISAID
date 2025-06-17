'use client';

import StayBoyTest from '@/public/images/star-boy-test.svg'; // 성향별 일러스트 나중에 바꿀 수 있음
import Button from '@/components/button';

interface RecommendedType {
  name: string;
  impact: string;
  hashtags: string[];
}

interface TestEndContainerProps {
  btnClick: () => void;
  riskType: string;
  recommendedTypes: RecommendedType[];
}

export const TestEndContainer = ({
  btnClick,
  riskType,
  recommendedTypes,
}: TestEndContainerProps) => {
  return (
    <div className='w-full flex flex-col items-center gap-8 pt-20 px-6'>
      {/* 상단 타이틀 */}
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold'>ETF 투자 성향 테스트 결과</h1>
        <h2 className='text-2xl font-bold text-hana-green'>{riskType}</h2>
        <p className='text-sm text-subtitle'>
          <span className='font-semibold text-primary'>OO</span>님의 투자 성향
          테스트 결과입니다
        </p>
      </div>

      {/* 일러스트 */}
      <StayBoyTest className='w-40 h-40' />

      {/* 추천 분류 결과 */}
      <div className='w-full max-w-xl space-y-6'>
        {recommendedTypes.map((type, index) => (
          <div
            key={index}
            className='w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm'
          >
            <p className='text-sm text-muted-foreground'>{type.name}</p>
            <p className='text-lg font-semibold mt-1'>{type.impact}</p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {type.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className='text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ETF 보러가기 버튼 */}
      <div className='w-full p-12'>
        <Button
          text='ETF 보러가기'
          thin={false}
          active={true}
          onClick={btnClick}
        />
      </div>
    </div>
  );
};
