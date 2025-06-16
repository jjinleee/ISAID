import React from 'react';
import QuestionOption from '@/components/question-option';
import { QuizQuestion } from '../data/questions';

interface QuizContentProps {
  question: QuizQuestion;
  current: number;
  total: number;
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function QUIZContent({
  question,
  current,
  total,
  selectedAnswer,
  onSelect,
  onPrev,
  onNext,
}: QuizContentProps) {
  return (
    <div className='flex flex-col p-5  space-y-6'>
      {/* 진행 바 */}
      <div className='h-1 bg-gray-2 rounded'>
        <div
          className='h-full bg-primary rounded'
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* 문제 영역 */}
      <div className='w-full h-full p-5 border-gray-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_-2px_4px_rgba(0,0,0,0.15)] rounded-2xl'>
        <div className='text-sm text-gray-500'>문제 {current + 1}</div>
        <h2 className='text-lg font-semibold mb-10'>{question.question}</h2>

        <div className='flex flex-col w-full gap-3 mb-10'>
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

      {/* 네비 버튼 */}
      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          disabled={current === 0}
          className='px-4 py-2 bg-gray-2 rounded-md disabled:opacity-50'
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={!selectedAnswer}
          className='px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50'
        >
          {current === total - 1 ? '결과 보기' : '다음'}
        </button>
      </div>
    </div>
  );
}
