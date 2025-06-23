import QuestionOption from '@/components/question-option';
import { QuizQuestion } from '../data/questions';

interface Props {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
}

export default function QUIZContent({
  question,
  selectedAnswer,
  onSelect,
}: Props) {
  return (
    <div className='flex flex-col p-5 space-y-6'>
      <div className='w-full h-full p-5 border-gray-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_-2px_4px_rgba(0,0,0,0.15)] rounded-2xl'>
        <div className='text-sm text-gray-500'>문제 1</div>
        <h2 className='text-lg font-semibold mb-10'>{question.question}</h2>

        <div className='flex flex-col w-full gap-3'>
          {question.options.map((option) => (
            <QuestionOption
              key={option.value}
              text={option.label}
              active={selectedAnswer === option.value}
              onClick={() => onSelect(option.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
