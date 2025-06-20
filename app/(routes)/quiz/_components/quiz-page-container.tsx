'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { getTodayKSTString } from '@/lib/utils';
import { questions } from '../data/questions';
import QUIZContent from './quiz-content';
import ResultPage from './result-page';

export default function QUIZPageContainer() {
  const { setHeader } = useHeader();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const todayStr = getTodayKSTString();

  useEffect(() => {
    const key = 'quizAnswersByDate';
    const stored = localStorage.getItem(key);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[todayStr]) {
        setAnswers(parsed[todayStr]);
        setShowResult(true);
        setIsReviewMode(true);
      }
    }

    setInitialLoaded(true);
  }, [todayStr]);

  useEffect(() => {
    if (!initialLoaded) return;
    setHeader('오늘의 금융 퀴즈', showResult ? '퀴즈 결과' : '1 / 1');
  }, [setHeader, showResult, initialLoaded]);

  const handleSelect = (value: string) => {
    const newAnswers = { 0: value };
    setAnswers(newAnswers);
    setShowResult(true);

    const key = 'quizAnswersByDate';
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[todayStr] = newAnswers;
    localStorage.setItem(key, JSON.stringify(parsed));
  };

  if (!initialLoaded) return null;

  if (showResult) {
    return (
      <ResultPage
        questions={questions}
        answers={answers}
        isReviewMode={isReviewMode}
      />
    );
  }

  return (
    <QUIZContent
      question={questions[0]}
      selectedAnswer={answers[0] ?? null}
      onSelect={handleSelect}
    />
  );
}
