'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizTrophy from '@/public/images/quiz-trophy.svg';
import QuestionOption from '@/components/question-option';
import { getTodayKSTString } from '@/lib/utils';
import { QuizQuestion } from '../data/questions';

interface ResultPageProps {
  questions: QuizQuestion[];
  answers: Record<number, string>;
  isReviewMode?: boolean;
}

export default function ResultPage({
  questions,
  answers,
  isReviewMode = false,
}: ResultPageProps) {
  const router = useRouter();
  const todayStr = getTodayKSTString();

  const question = questions[0];
  const userAnswer = answers[0];

  useEffect(() => {
    if (isReviewMode) return;

    const dateKey = 'quizCompletedDates';
    const answerKey = 'quizAnswersByDate';

    const storedDates = JSON.parse(localStorage.getItem(dateKey) || '[]');
    if (!storedDates.includes(todayStr)) {
      localStorage.setItem(dateKey, JSON.stringify([...storedDates, todayStr]));
    }

    const savedAnswers = JSON.parse(localStorage.getItem(answerKey) || '{}');
    savedAnswers[todayStr] = answers;
    localStorage.setItem(answerKey, JSON.stringify(savedAnswers));
  }, [answers, isReviewMode, todayStr]);

  const selectedOption = question.options.find((o) => o.value === userAnswer);
  const isCorrect = selectedOption?.isCorrect ?? false;

  return (
    <div className='flex flex-col p-5 space-y-6'>
      <div className='w-full bg-primary rounded-lg p-6 text-center text-white'>
        <QuizTrophy className='mx-auto' />
        <h1 className='text-2xl font-bold mb-2'>퀴즈 완료!</h1>
        <p>
          {isReviewMode
            ? '복기 중입니다'
            : isCorrect
              ? '정답입니다!'
              : '틀렸습니다!'}
        </p>
      </div>

      <div className='w-full h-full p-5 border-gray-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_-2px_4px_rgba(0,0,0,0.15)] rounded-2xl'>
        <div className='text-sm text-gray-500 mb-1'>문제 1</div>
        <h2 className='text-lg font-semibold mb-10'>{question.question}</h2>

        <div className='flex flex-col w-full gap-2 mb-10'>
          {question.options.map((option) => {
            const isSelected = option.value === userAnswer;
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

      <button
        onClick={() => router.push('/main')}
        className='w-full py-4 text-lg font-semibold text-white bg-primary rounded-xl'
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}
