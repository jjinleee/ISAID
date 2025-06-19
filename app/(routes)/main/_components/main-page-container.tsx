'use client';

import { useEffect, useState } from 'react';
import MainPageToQuiz from './main-page-to-quiz';

const MainPageContainer = () => {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('quizCompletedDates');
    if (stored) {
      setCompletedDates(JSON.parse(stored).map((d: string) => new Date(d)));
    }
  }, []);

  const handleQuizComplete = (date: Date) => {
    const updated = [...completedDates, date];
    setCompletedDates(updated);
    localStorage.setItem('quizCompletedDates', JSON.stringify(updated));
  };
  return (
    <div className='px-4 py-10'>
      <MainPageToQuiz onComplete={handleQuizComplete} />
    </div>
  );
};

export default MainPageContainer;
