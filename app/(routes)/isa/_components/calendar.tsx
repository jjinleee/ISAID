'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useState } from 'react';
import { CalendarIcon } from '@/public/images/isa/calendar-icon';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type Transaction = {
  title: string;
  amount: number;
  type: '매수' | '매도' | '입금' | '출금' | '배당금';
};

const Calendar = () => {
  const today = new Date();
  const [selected, setSelected] = useState<Date | undefined>();

  const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

  const transactionDates = [
    new Date(2025, 5, 3),
    new Date(2025, 5, 9),
    new Date(2025, 5, 15),
  ];

  const transactionData: Record<string, Transaction[]> = {
    '2025-06-03': [{ title: 'ISA 계좌입금', amount: 500000, type: '입금' }],
    '2025-06-09': [{ title: '삼성전자', amount: 195895, type: '매수' }],
    '2025-06-15': [
      { title: 'LG화학', amount: 283000, type: '매도' },
      { title: '배당금 수령', amount: 12500, type: '배당금' },
    ],
  };

  const typeStyles: Record<Transaction['type'], string> = {
    매수: 'text-red-500',
    매도: 'text-blue-500',
    입금: 'text-green-500',
    출금: 'text-gray-500',
    배당금: 'text-yellow-600',
  };

  const typeIcons: Record<Transaction['type'], string> = {
    매수: '👜',
    매도: '🔖',
    입금: '💰',
    출금: '💸',
    배당금: '🪙',
  };

  const selectedKey = selected ? formatDateKey(selected) : null;
  const transactions = selectedKey ? transactionData[selectedKey] : null;

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

      {transactions && (
        <div className='mt-6 px-2'>
          <p className='font-semibold text-lg mb-2'>
            {format(selected!, 'M월 d일 (E)', { locale: ko })}
          </p>
          <ul className='space-y-3'>
            {transactions.map((tx, idx) => (
              <li
                key={idx}
                className='flex justify-between items-center rounded-md py-2 px-3 shadow-sm bg-white'
              >
                <div>
                  <p className='font-semibold'>{tx.title}</p>
                  <p className={`text-sm font-semibold ${typeStyles[tx.type]}`}>
                    {/* {typeIcons[tx.type]} */}
                    {tx.type}
                  </p>
                </div>
                <div className='text-right font-semibold'>
                  {tx.amount.toLocaleString()}원
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendar;
