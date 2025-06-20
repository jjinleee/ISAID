'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { questions } from '../data/questions';
import QUIZContent from './quiz-content';
import ResultPage from './result-page';

export default function QUIZPageContainer() {
  const { setHeader } = useHeader();
  const total = questions.length;

  const [current, setCurrent] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [shouldShowResult, setShouldShowResult] = useState(false);

  // localStorage에서 오늘 푼 답안 불러오기
  useEffect(() => {
    const key = 'quizAnswersByDate';
    const todayStr = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(key);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[todayStr]) {
        setAnswers(parsed[todayStr]);
        setCurrent(questions.length); // 퀴즈 완료 상태로 전환
      }
    }

    setInitialLoaded(true);
  }, []);

  // current === total 이 되면 결과 페이지 보여주기
  useEffect(() => {
    if (initialLoaded && current === total) {
      setShouldShowResult(true);
    }
  }, [initialLoaded, current, total]);

  useEffect(() => {
    if (!initialLoaded) return;
    const subtitle =
      current === total ? '퀴즈 결과' : `${current + 1} / ${total}`;
    setHeader('오늘의 금융 퀴즈', subtitle);
  }, [setHeader, current, total, initialLoaded]);

  // 선택 및 페이지 이동 로직
  const selectAnswer = (value: string) =>
    setAnswers((prev) => ({ ...prev, [current]: value }));

  const goPrev = () => setCurrent((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrent((i) => Math.min(i + 1, total));

  // 아직 초기화 전이면 렌더링 X
  if (!initialLoaded) return null;

  // 결과 페이지 렌더링 조건
  if (shouldShowResult) {
    return <ResultPage questions={questions} answers={answers} />;
  }

  // 퀴즈 문제 페이지
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
