import React from 'react';
import QuestionOption from '@/components/question-option';
import { QuizQuestion } from '../data/questions';

interface ResultPageProps {
  questions: QuizQuestion[];
  answers: Record<number, string>;
}

export default function ResultPage({ questions, answers }: ResultPageProps) {
  // 틀린 문제들만 필터링
  const wrongList = questions
    .map((q, idx) => ({ question: q, answer: answers[idx], index: idx }))
    .filter(
      (item) =>
        !item.question.options.find((o) => o.value === item.answer)?.isCorrect
    );

  const wrongCount = wrongList.length;
  const total = questions.length;
  const score = total - wrongCount;

  return (
    <div className='flex flex-col p-5 space-y-6'>
      {/* 결과 요약 카드 */}
      <div className='w-full bg-primary rounded-lg p-6 text-center text-white'>
        <h1 className='text-2xl font-bold mb-2'>퀴즈 완료!</h1>
        <p>
          {total}문제 중 {score}문제 정답
        </p>
        <p>정답률: {Math.round((score / total) * 100)}%</p>
      </div>

      {/* 오답 문제 리스트 */}
      {wrongList.map(({ question, answer, index }) => (
        <div
          key={question.id}
          className='w-full h-full p-5 border-gray-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_-2px_4px_rgba(0,0,0,0.15)] rounded-2xl'
        >
          <div className='text-sm text-gray-500 mb-1'>문제 {index + 1}</div>
          <h2 className='text-lg font-semibold mb-10'>{question.question}</h2>

          <div className='flex flex-col w-full gap-2 mb-10'>
            {question.options.map((option) => {
              const isSelected = option.value === answer;
              const isCorrect = option.isCorrect;
              return (
                <QuestionOption
                  key={option.value}
                  text={option.label}
                  active={isCorrect}
                  error={isSelected && !isCorrect}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
