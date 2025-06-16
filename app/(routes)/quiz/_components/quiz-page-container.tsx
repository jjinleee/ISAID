'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { questions, QuizOption, QuizQuestion } from '../data/questions';
import QUIZContent from './quiz-content';
import ResultPage from './result-page';

export default function QUIZPageContainer() {
  const { setHeader } = useHeader();

  const total = questions.length;
  const [current, setCurrent] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  useEffect(() => {
    const subtitle =
      current === total ? '퀴즈 결과' : `${current + 1} / ${total}`;
    setHeader('오늘의 금융 퀴즈', subtitle);
  }, [setHeader, current, total]);

  const selectAnswer = (value: string) =>
    setAnswers((prev) => ({ ...prev, [current]: value }));

  const goPrev = () => setCurrent((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrent((i) => Math.min(i + 1, total));

  if (current === total) {
    return <ResultPage questions={questions} answers={answers} />;
  }

  return (
    <QUIZContent
      question={questions[current]}
      current={current}
      total={total}
      selectedAnswer={answers[current] ?? null}
      onSelect={selectAnswer}
      onPrev={goPrev}
      onNext={goNext}
    />
  );
}
