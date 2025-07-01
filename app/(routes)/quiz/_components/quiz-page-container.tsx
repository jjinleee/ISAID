'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import QUIZContent from './quiz-content';
import ResultPage from './result-page';

type Selection = {
  id: string;
  questionId: string;
  content: string;
};

type Question = {
  id: string;
  content: string;
  description: string;
  selections: Selection[];
};

export default function QUIZPageContainer() {
  const { setHeader } = useHeader();
  const searchParams = useSearchParams();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const isReview = searchParams?.get('review') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/quiz/question');
        if (!res.ok) throw new Error('퀴즈 데이터 불러오기 실패');

        const data = await res.json();
        setQuestion(data.question);

        // 복기 모드일 경우
        if (isReview && data.correctAnswerId) {
          setSelectedId(data.correctAnswerId);
          setCorrectAnswerId(data.correctAnswerId);
          setIsCorrect(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isReview, searchParams]);

  useEffect(() => {
    setHeader('오늘의 금융 퀴즈', selectedId ? '퀴즈 결과' : '1 / 1');
  }, [setHeader, selectedId]);

  const handleSelect = async (choiceId: string) => {
    if (!question) return;
    setSelectedId(choiceId);

    try {
      const res = await fetch('/api/quiz/question/submit', {
        method: 'POST',
        body: JSON.stringify({
          questionId: question.id,
          selectedId: choiceId,
        }),
      });

      if (!res.ok) throw new Error('정답 제출 실패');

      const data = await res.json();
      setIsCorrect(data.isCorrect);
      setCorrectAnswerId(data.correctAnswerId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !question) {
    return <div className='p-5'>문제를 불러오는 중입니다...</div>;
  }

  if (selectedId && correctAnswerId !== null) {
    return (
      <ResultPage
        question={question}
        selectedId={selectedId}
        correctAnswerId={correctAnswerId}
        isCorrect={!!isCorrect}
        isReviewMode={isReview}
      />
    );
  }

  return (
    <QUIZContent
      question={question}
      selectedAnswer={selectedId}
      onSelect={handleSelect}
    />
  );
}
