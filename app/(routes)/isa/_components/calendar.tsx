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

  const transactionDates = [
    new Date(2025, 5, 3), // 6월 3일
    new Date(2025, 5, 9), // 6월 9일
    new Date(2025, 5, 15), // 6월 15일
  ];

  const transactionData: Record<string, string[]> = {
    '2025-06-03': ['ISA 입금 500,000원'],
    '2025-06-09': ['매수 - 삼성전자 10주'],
    '2025-06-15': ['매도 - LG화학 5주'],
  };

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
          locale={ko}
          navLayout='around'
          animate
          formatters={{
            formatCaption: (date) => format(date, 'yyyy년 M월', { locale: ko }),
          }}
          modifiers={{
            hasTransaction: transactionDates,
          }}
          modifiersClassNames={{
            hasTransaction: 'rdp-day_hasTx',
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
