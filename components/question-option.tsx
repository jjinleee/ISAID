import { CircleCheck } from '@/public/images/circle-check';
import { CircleEmpty } from '@/public/images/circle-empty';
import type { QuestionOptionProps } from '@/types/components.ts';
import { Button } from '@/components/ui/button';

// onClick event 가 있는 컴포넌트입니다. 부모 컴포넌트에서 use client 선언을 해주셔야 오류 없이 사용 가능합니다.
// ex) <QuestionOption
//   text={'gml'}
//   active={true}
//   onClick={() => {
//     console.log('gungun');
//   }}
// />
export const QuestionOption = ({
  text,
  active,
  onClick,
}: QuestionOptionProps) => {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      className="w-full text-left justify-start h-auto p-4 border border-gray-2 py-2 font-normal"
      onClick={onClick}
    >
      <div
        className={`flex items-center gap-3 ${active ? 'text-white' : 'text-black'}`}
      >
        {active ? (
          <CircleCheck className="!w-6 !h-6" />
        ) : (
          <CircleEmpty className="!w-6 !h-6" />
        )}

        <span>{text}</span>
      </div>
    </Button>
  );
};

export default QuestionOption;
