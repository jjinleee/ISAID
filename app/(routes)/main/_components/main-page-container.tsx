'use client';

import { useEffect, useState } from 'react';
import { isSameDay } from 'date-fns';
import MainPageToQuiz from './main-page-to-quiz';
import WeeklyCalendar from './weekly-calendar'; // 경로에 맞게 수정

const MainPageContainer = () => {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ 퀴즈 완료 날짜 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('quizCompletedDates');
    if (stored) {
      setCompletedDates(JSON.parse(stored).map((d: string) => new Date(d)));
    }
  }, []);

  // ✅ 퀴즈 완료 처리
  const handleQuizComplete = (date: Date) => {
    const alreadyExists = completedDates.some((d) => isSameDay(d, date));
    if (alreadyExists) return;

    const updated = [...completedDates, date];
    setCompletedDates(updated);
    localStorage.setItem('quizCompletedDates', JSON.stringify(updated));
  };

  return (
    <div className='px-4 py-10 space-y-6'>
      <MainPageToQuiz onComplete={handleQuizComplete} />
      <WeeklyCalendar
      // selectedDate={selectedDate}
      // onSelect={setSelectedDate}
      // completedDates={completedDates}
      />
    </div>
  );
};

export default MainPageContainer;
