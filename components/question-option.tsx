import type { QuestionOptionProps } from '@/types/components.ts';
import { Button } from '@/components/ui/button';
import { CircleCheck } from '@/public/images/circle-check';
import { CircleEmpty } from '@/public/images/circle-empty';

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
