'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import { rewardConsentList } from '@/data/consent-data';
import { ReasonProps } from '@/types/etf';
import { isSameDay } from 'date-fns';
import { getKSTDateFromISOString, getTodayKSTDate } from '@/lib/utils';
import AccountSummaryCard from './account-summary-card';
import AgreeConfirmModal from './agree-confirm-modal';
import AgreeModal from './agree-modal';
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
  savedTax: number;
}

export interface RewardProps extends ReasonProps {
  detail: string[];
}

export default function MainPageContainer({ userName, savedTax }: Props) {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [accountInfo, setAccountInfo] = useState<ISAAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const router = useRouter();

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

    // 동의 여부 확인
    const fetchAgreed = async () => {
      try {
        const res = await fetch('/api/user/reward-agree', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (!res.ok) throw new Error('응답 오류');
        }

        const data = await res.json();
        setIsAgree(data.rewardAgreed ?? false);
      } catch (err) {
        console.error(err);
        toast.error('동의 정보 조회에 실패했습니다. 다시 시도해 주세요.');
        setIsAgree(false);
      }
    };
    fetchAgreed();
    fetchAllData();
  }, []);

  const calculateStreakLabel = (dates: Date[]): string => {
    if (dates.length === 0) return '퀴즈를 풀고 출석해보세요!';

    const today = getTodayKSTDate();

    const sorted = dates
      .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()))
      .sort((a, b) => a.getTime() - b.getTime());

    const todayAttendance = sorted.some((d) => isSameDay(d, today));

    if (todayAttendance) {
      // 오늘 출석했으면 오늘부터 streak 계산
      let count = 1;
      for (let i = sorted.length - 1; i > 0; i--) {
        const curr = sorted[i];
        const prev = sorted[i - 1];
        const diffDays =
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          count++;
        } else if (diffDays >= 2) {
          break;
        }
      }
      return count === 1 ? '출석 1일차' : `연속 출석 ${count}일차`;
    } else {
      // 오늘 출석 안했을 때 → "어제까지 streak 계산"
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // 어제 출석했는지 확인
      const yesterdayAttendance = sorted.some((d) => isSameDay(d, yesterday));
      if (!yesterdayAttendance) {
        return '퀴즈를 풀고 출석해보세요!';
      }

      // 어제부터 거꾸로 연속 출석 streak 계산
      let count = 1;
      for (let i = sorted.length - 1; i > 0; i--) {
        const curr = sorted[i];
        const prev = sorted[i - 1];

        if (isSameDay(curr, yesterday) || curr < yesterday) {
          const diffDays =
            (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
            count++;
          } else if (diffDays >= 2) {
            break;
          }
        }
      }

      return count === 1
        ? '어제 1일 출석했어요!'
        : `어제까지 ${count}일 연속 출석했어요!`;
    }
  };

  const streakLabel = useMemo(
    () => calculateStreakLabel(completedDates),
    [completedDates]
  );

  if (loading) {
    return <div className='p-4 text-center text-gray-500'>로딩중...</div>;
  }

  const clickChallenge = () => {
    if (!isAgree) {
      setShowModal(true);
      return;
    }
    router.push('/challenge');
  };

  const handleAgree = () => {
    setShowModal(false);
    setIsAgree(true);
    setShowConfirmModal(true);
  };

  const handleTermsAgree = () => {
    setTermsAgreed(true);
    setShowDetailModal(false);
  };

  const detailClick = () => {
    setShowDetailModal(true);
  };

  const handleConsent = async () => {
    try {
      const res = await fetch('/api/user/reward-agree', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        toast.error('동의 처리에 실패하였습니다. 다시 시도해 주세요.');
      }

      if (res.ok) {
        toast.success('동의 처리가 완료되었습니다.');
        router.push('/challenge');
      }
    } catch (err) {
      console.log(err);
      toast.error('동의 처리에 실패하였습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className='px-4 py-5 space-y-6'>
      <ChallengeCard onClick={clickChallenge} />
      <QuizBanner streakLabel={streakLabel} completedDates={completedDates} />
      <WeeklyCalendar completedDates={completedDates} />
      {accountInfo && (
        <AccountSummaryCard account={accountInfo} savedTax={savedTax} />
      )}
      {/*<BeginnerGuideCard />*/}

      {/* 약관 개요 모달 */}
      {showModal && (
        <AgreeModal
          onClose={() => setShowModal(false)}
          btnClick={() => handleAgree()}
          reasons={rewardConsentList}
        />
      )}

      {/*약관 동의 확인 모달*/}
      {showConfirmModal && <AgreeConfirmModal onClose={handleConsent} />}
    </div>
  );
}
