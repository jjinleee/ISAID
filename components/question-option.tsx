import { CircleCheck } from '@/public/images/circle-check';
import { CircleEmpty } from '@/public/images/circle-empty';
import type { QuestionOptionProps } from '@/types/components.ts';
import { Button } from '@/components/ui/button';

// 사용자가 선택한 오답에만 빨간 배경/테두리를 적용합니다.

export const QuestionOption = ({
  text,
  active,
  error = false,
  onClick,
}: QuestionOptionProps) => {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      className={`
        w-full text-left justify-start h-auto p-4
        border ${error ? 'border-hana-red bg-hana-red' : 'border-gray-2'}
        font-normal rounded-xl
      `}
      onClick={onClick}
      disabled={error}
    >
      <div
        className={`flex items-center gap-3 ${
          active ? 'text-white' : error ? 'text-white' : 'text-black'
        }`}
      >
        {active || error ? (
          <CircleCheck className='!w-6 !h-6' />
        ) : (
          <CircleEmpty className='!w-6 !h-6' />
        )}
        <span>{text}</span>
      </div>
    </Button>
  );
};

export default QuestionOption;
