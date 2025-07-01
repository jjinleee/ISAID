'use client';

import QuestionOption from '@/components/question-option';

type Selection = {
  id: string;
  questionId: string;
  content: string;
};

type Question = {
  id: string;
  content: string;
  selections: Selection[];
};

interface Props {
  question: Question;
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
        <div className='text-sm text-gray-500'>오늘의 문제</div>
        <h2 className='text-lg font-semibold mb-10'>{question.content}</h2>

        <div className='flex flex-col w-full gap-3'>
          {question.selections.map((option) => (
            <QuestionOption
              key={option.id}
              text={option.content}
              active={selectedAnswer === option.id}
              onClick={() => onSelect(option.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
