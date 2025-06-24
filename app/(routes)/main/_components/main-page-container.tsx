'use client';

import { useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns';
import { getKSTDateFromISOString, getTodayKSTDate } from '@/lib/utils';
import AccountSummaryCard from './account-summary-card';
import BeginnerGuideCard from './beginner-guide-card';
import ChallengeCard from './challenge-card';
import QuizBanner from './quiz-banner';
import WeeklyCalendar from './weekly-calendar';

export default function MainPageContainer() {
  const [completedDates, setCompletedDates] = useState<Date[] | null>(null);

  useEffect(() => {
    const fetchCompletedDates = async () => {
      try {
        const res = await fetch('/api/quiz/calendar');
        const data = await res.json();
        const normalized = data.solvedDates.map((d: string) =>
          getKSTDateFromISOString(d)
        );
        setCompletedDates(normalized);
      } catch (error) {
        console.error('출석 데이터 로딩 실패:', error);
      }
    };

    fetchCompletedDates();
  }, []);

  const calculateStreakLabel = (dates: Date[]): string => {
    const sorted = dates
      .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (sorted.length === 0) return '퀴즈를 풀고 출석해보세요!';
    const today = getTodayKSTDate();
    const last = sorted[sorted.length - 1];
    if (!isSameDay(last, today)) return '퀴즈를 풀고 출석해보세요!';

    let count = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const curr = sorted[i];
      const prev = sorted[i - 1];
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) count++;
      else break;
    }

    return count === 1 ? '출석 1일차' : `연속 출석 ${count}일차`;
  };

  const streakLabel = useMemo(
    () => (completedDates ? calculateStreakLabel(completedDates) : ''),
    [completedDates]
  );

  if (!completedDates) {
    return <div className='p-4 text-center text-gray-500'>로딩중...</div>;
  }

  return (
    <div className='px-4 py-5 space-y-6'>
      <ChallengeCard />
      <QuizBanner streakLabel={streakLabel} completedDates={completedDates} />
      <WeeklyCalendar completedDates={completedDates} />
      <AccountSummaryCard />
      <BeginnerGuideCard />
    </div>
  );
}
