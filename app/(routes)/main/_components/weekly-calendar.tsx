'use client';

import { useState } from 'react';
import { CalendarIcon } from '@/public/images/isa/calendar-icon';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

interface WeeklyCalendarProps {
  completedDates: Date[];
}

export default function WeeklyCalendar({
  completedDates,
}: WeeklyCalendarProps) {
  const today = new Date();
  const [baseDate, setBaseDate] = useState(today);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const getStartOfWeek = (base: Date) => {
    const day = base.getDay(); // 일:0 ~ 토:6
    return addDays(base, -day);
  };

  const weekStart = getStartOfWeek(baseDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getWeekLabel = (date: Date) => {
    const month = date.getMonth() + 1;
    const weekNumber = Math.ceil((date.getDate() + 1) / 7);
    return `${month}월 ${weekNumber}주차`;
  };

  const handleWeekChange = (type: 'next' | 'prev') => {
    setDirection(type);
    setBaseDate((prev) =>
      type === 'next' ? addDays(prev, 7) : subDays(prev, 7)
    );
  };

  return (
    <div className='bg-white px-4 space-y-3 overflow-hidden'>
      {/* 상단 헤더 */}
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex gap-1'>
            <CalendarIcon />
            <p className='text-base font-bold'>{getWeekLabel(weekStart)}</p>
          </div>
          <p className='text-xs text-gray-400 pl-7'>이번 주 퀴즈 출석 현황</p>
        </div>
        <div className='flex items-center gap-2 text-gray-500'>
          <button onClick={() => handleWeekChange('prev')}>{'<'}</button>
          <button onClick={() => handleWeekChange('next')}>{'>'}</button>
        </div>
      </div>

      {/* 요일 라벨 */}
      <div className='grid grid-cols-7 text-center text-sm font-semibold text-black'>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 날짜 슬라이드 */}
      <div className='relative h-10 overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={weekStart.toISOString()}
            initial={{ x: direction === 'next' ? 100 : -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute top-0 left-0 w-full grid grid-cols-7 text-center text-sm'
          >
            {weekDates.map((day) => {
              const isCompleted = completedDates.some((d) => isSameDay(d, day));

              return (
                <div
                  key={day.toISOString()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto transition
                    ${isCompleted ? 'bg-primary text-white font-bold' : 'text-gray-800'}
                  `}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
