'use client';

import { useEffect, useMemo, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { isSameDay } from 'date-fns';
import { getKSTDateFromISOString, getTodayKSTDate } from '@/lib/utils';
import AccountSummaryCard from './account-summary-card';
import BeginnerGuideCard from './beginner-guide-card';
import ChallengeCard from './challenge-card';
import QuizBanner from './quiz-banner';
import WeeklyCalendar from './weekly-calendar';

type ISAAccount = {
  bankCode:
    | '하나증권'
    | '미래에셋증권'
    | '삼성증권'
    | 'NH투자증권'
    | '한국투자증권'
    | '키움증권'
    | '신한투자증권'
    | 'KB증권';
  accountNum: string;
  currentBalance: string;
  paymentAmount: string;
  accountType: string;
};

interface Props {
  userName?: string;
}

export default function MainPageContainer({ userName }: Props) {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [accountInfo, setAccountInfo] = useState<ISAAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const { setHeader } = useHeader();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 헤더 설정
        setHeader(`안녕하세요, ${userName} 님`, '오늘도 현명한 투자하세요');

        // 출석 데이터
        const calendarRes = await fetch('/api/quiz/calendar');
        const calendarData = await calendarRes.json();
        const normalized = calendarData.solvedDates.map((d: string) =>
          getKSTDateFromISOString(d)
        );
        setCompletedDates(normalized);

        // ISA 계좌 정보
        const isaRes = await fetch('/api/isa');
        if (isaRes.ok) {
          const isaData = await isaRes.json();
          setAccountInfo({
            bankCode: isaData.bankCode,
            accountNum: isaData.accountNum,
            currentBalance: isaData.currentBalance,
            paymentAmount: isaData.paymentAmount,
            accountType: isaData.accountType,
          });
        } else {
          setAccountInfo(null); // 계좌 없음
        }
      } catch (error) {
        console.error('메인페이지 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
    () => calculateStreakLabel(completedDates),
    [completedDates]
  );

  if (loading) {
    return <div className='p-4 text-center text-gray-500'>로딩중...</div>;
  }

  return (
    <div className='px-4 py-5 space-y-6'>
      <ChallengeCard />
      <QuizBanner streakLabel={streakLabel} completedDates={completedDates} />
      <WeeklyCalendar completedDates={completedDates} />
      {accountInfo && <AccountSummaryCard account={accountInfo} />}
      <BeginnerGuideCard />
    </div>
  );
}
