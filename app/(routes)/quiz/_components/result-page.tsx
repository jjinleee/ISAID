'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizTrophy from '@/public/images/quiz-trophy.svg';
import { isSameDay } from 'date-fns';
import QuestionOption from '@/components/question-option';
import { QuizQuestion } from '../data/questions';

interface ResultPageProps {
  questions: QuizQuestion[];
  answers: Record<number, string>;
}

export default function ResultPage({ questions, answers }: ResultPageProps) {
  const today = new Date();
  const router = useRouter();

  // 퀴즈 완료 날짜 저장/답안 저장
  useEffect(() => {
    const key = 'quizCompletedDates';
    const answerKey = 'quizAnswersByDate';

    const stored = localStorage.getItem(key);
    const parsed: string[] = stored ? JSON.parse(stored) : [];

    const todayStr = today.toISOString().split('T')[0];
    if (!parsed.includes(todayStr)) {
      const updated = [...parsed, todayStr];
      localStorage.setItem(key, JSON.stringify(updated));
    }

    // 오늘 답안 저장
    const savedAnswers = localStorage.getItem(answerKey);
    const parsedAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};
    parsedAnswers[todayStr] = answers;
    localStorage.setItem(answerKey, JSON.stringify(parsedAnswers));
  }, []);

  // 2. 기존 결과 렌더링 로직
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
        <QuizTrophy className='mx-auto' />
        <h1 className='text-2xl font-bold mb-2'>퀴즈 완료!</h1>
        <p>
          {total}문제 중 {score}문제 정답
        </p>
        <p>정답률: {Math.round((score / total) * 100)}%</p>
      </div>

      {/* 오답 리스트 */}
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
      <button
        onClick={() => router.push('/main')}
        className='w-full py-4 text-lg font-semibold text-white bg-primary rounded-xl'
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}
