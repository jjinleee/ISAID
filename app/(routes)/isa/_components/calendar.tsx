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
  type: '매수' | '매도' | '입금' | '출금' | '배당금' | '챌린지 리워드';
};

const Calendar = ({ data }: { data: any }) => {
  const today = new Date();
  const [selected, setSelected] = useState<Date | undefined>();

  const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

  const selectedKey = selected ? formatDateKey(selected) : null;
  const transactions = selectedKey ? data.transactionData[selectedKey] : null;

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
            hasTransaction: data?.transactionDates,
          }}
          modifiersClassNames={{
            hasTransaction: 'rdp-day_hasTx',
          }}
        />
      </div>

      {transactions && (
        <div className='mt-5 px-4'>
          <p className='text-base font-semibold mb-4'>
            {format(selected!, 'M월 d일 (E)', { locale: ko })}
          </p>
          <ul className='space-y-3'>
            {transactions.map((tx: Transaction, idx: number) => (
              <li
                key={idx}
                className='bg-white rounded-xl px-4 py-3 flex justify-between items-center shadow-sm'
              >
                {/* 왼쪽: 항목 정보 */}
                <div className='space-y-1'>
                  <p className='text-sm text-gray-800 font-semibold'>
                    {tx.title}
                  </p>
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-lg bg-opacity-10 font-medium ${
                      tx.type === '입금'
                        ? 'text-white font-semibold bg-green-600'
                        : tx.type === '매수'
                          ? 'text-white font-semibold bg-red-500'
                          : tx.type === '매도'
                            ? 'text-white font-semibold bg-blue-600'
                            : tx.type === '배당금'
                              ? 'text-white font-semibold bg-yellow-500'
                              : tx.type === '챌린지 리워드'
                                ? 'text-white font-semibold bg-pink-300' // ← 추가
                                : 'text-white font-semibold bg-gray-400'
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>

                {/* 오른쪽: 금액 */}
                <div className='text-right'>
                  <p className='font-semibold text-gray-800'>
                    {tx.amount.toLocaleString()}원
                  </p>
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
