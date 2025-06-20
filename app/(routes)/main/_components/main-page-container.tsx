'use client';

import { useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns';
import { getKSTDateFromISOString, getTodayKSTDate } from '@/lib/utils';
import AccountSummaryCard from './account-summary-card';
import BeginnerGuideCard from './beginner-guide-card';
import ChallengeCard from './challenge-card';
import QuizBanner from './quiz-banner';
import WeeklyCalendar from './weekly-calendar';

const MainPageContainer = () => {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  // streak 계산
  const calculateStreakLabel = (completedDates: Date[]): string => {
    const sorted = completedDates
      .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()))
      .sort((a, b) => a.getTime() - b.getTime()); // 오름차순 (과거 → 오늘)

    if (sorted.length === 0) return '퀴즈를 풀고 출석해보세요!';

    const today = getTodayKSTDate();
    const last = sorted[sorted.length - 1];

    // 1. 오늘 출석 안 했으면 → 출석 유도 문구
    if (!isSameDay(last, today)) {
      return '퀴즈를 풀고 출석해보세요!';
    }

    // 2. 오늘 출석한 경우 → 뒤에서부터 연속성 계산
    let count = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const curr = sorted[i];
      const prev = sorted[i - 1];

      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        count++;
      } else {
        break; // 하루라도 끊기면 종료
      }
    }

    return count === 1 ? '출석 1일차' : `연속 출석 ${count}일차`;
  };

  // 퀴즈 완료 날짜 로딩
  useEffect(() => {
    const stored = localStorage.getItem('quizCompletedDates');
    const preset: string[] = [];

    let storedDates: string[] = [];
    if (stored) {
      storedDates = JSON.parse(stored);
    }

    const merged = Array.from(new Set([...storedDates, ...preset]));

    // ✅ KST 기준 날짜 객체로 변환
    const normalizedDates = merged.map(getKSTDateFromISOString);
    setCompletedDates(normalizedDates);
  }, []);

  // 퀴즈 완료 처리
  const handleQuizComplete = () => {
    const today = getTodayKSTDate(); // KST 기준 날짜 객체
    const alreadyExists = completedDates.some((d) => isSameDay(d, today));
    if (alreadyExists) return;

    const updated = [...completedDates, today];
    setCompletedDates(updated);
    localStorage.setItem(
      'quizCompletedDates',
      JSON.stringify(updated.map((d) => d.toISOString()))
    );
  };

  const streakLabel = useMemo(
    () => calculateStreakLabel(completedDates),
    [completedDates]
  );

  return (
    <div className='px-4 py-5 space-y-6'>
      <ChallengeCard />
      <QuizBanner
        onComplete={handleQuizComplete}
        streakLabel={streakLabel}
        completedDates={completedDates}
      />
      <WeeklyCalendar completedDates={completedDates} />
      <AccountSummaryCard />
      <BeginnerGuideCard />
    </div>
  );
};

export default MainPageContainer;
