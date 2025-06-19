'use client';

import { useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns';
import AccountSummaryCard from './account-summary-card';
import BeginnerGuideCard from './beginner-guide-card';
import ChallengeCard from './challenge-card';
import QuizBanner from './quiz-banner';
import WeeklyCalendar from './weekly-calendar';

const MainPageContainer = () => {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);

  // ✅ streak 계산
  const calculateStreakLabel = (completedDates: Date[]): string => {
    const sorted = completedDates
      .map((d) => new Date(d.setHours(0, 0, 0, 0)))
      .sort((a, b) => b.getTime() - a.getTime());

    let count = 0;
    const day = new Date();
    day.setHours(0, 0, 0, 0);

    for (const d of sorted) {
      if (isSameDay(d, day)) {
        count++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }

    return count <= 1 ? '출석 1일차' : `연속 출석 ${count}일차`;
  };

  // ✅ 퀴즈 완료 날짜 로딩
  useEffect(() => {
    const stored = localStorage.getItem('quizCompletedDates');
    const preset = ['2025-06-17', '2025-06-18'];

    let storedDates: string[] = [];
    if (stored) {
      storedDates = JSON.parse(stored); // 문자열 배열로 저장했다고 가정
    }

    // 중복 제거
    const merged = Array.from(new Set([...storedDates, ...preset]));

    setCompletedDates(merged.map((d) => new Date(d)));
  }, []);

  // ✅ 퀴즈 완료 처리
  const handleQuizComplete = (date: Date) => {
    const alreadyExists = completedDates.some((d) => isSameDay(d, date));
    if (alreadyExists) return;

    const updated = [...completedDates, date];
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
