'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from 'react';
import { CalendarIcon } from '@/public/images/isa/calendar-icon';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const Calendar = () => {
  const today = new Date();
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <div className='flex flex-col mt-3'>
      <div className='flex gap-2 mb-4'>
        <CalendarIcon />
        <p className='font-semibold'>한눈에 보는 나의 금융 캘린더</p>
      </div>
      <div className='w-full'>
        <DayPicker
          mode='single'
          selected={selected}
          onSelect={setSelected}
          defaultMonth={today}
          modifiers={{ today }}
          locale={ko}
          navLayout='around'
          animate
          formatters={{
            formatCaption: (date) => format(date, 'yyyy년 M월', { locale: ko }),
          }}
          className='w-full'
          classNames={{
            /* ② 네비게이션 래퍼 재정의: 가운데 정렬 + 4px 간격 */
            nav: 'flex items-center justify-center gap-1',

            /* 필요하면 화살표·캡션에 추가 스타일 */
            nav_button: 'p-1 rounded hover:bg-gray-100',
            caption_label: 'font-semibold mx-1',
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
