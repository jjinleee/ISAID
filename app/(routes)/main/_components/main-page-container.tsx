'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
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
  const rewardConsentList: RewardProps[] = [
    {
      title: 'ETF 리워드 수령 동의',
      description:
        '챌린지 성공 시 제공되는 소수점 ETF 보상을 수령하기 위해 필요한 최소한의 동의입니다.',
      detail: [
        '회사 인증 후 ISA 계좌를 연결하고 챌린지 성공 시 소수점 ETF 매수·입고를 T+2 영업일 이내 일임 처리합니다.',
        '일임 범위는 보상용 소수점 ETF 매수·입고에 한정되며 임의 매매는 실행하지 않습니다.',
        '보상 ETF가 ISA 비과세 한도를 초과하면 9.9 % 분리과세 대상이 됩니다.',
        '부정 참여·허위 계좌 연결 등 발견 시 보상 지급이 취소·회수될 수 있습니다.',
        'ETF는 지수·세제·환율 변동 등으로 원금 손실이 발생할 수 있고, 소수점 단위는 유동성 제한으로 매도 시점이 불리할 수 있습니다.',
        '회사는 보상 집행 외의 자산 운용·손익에 책임을 지지 않습니다.',
      ],
    },
    {
      title: '개인정보 제공 동의',
      description:
        '보상 산정·지급, 법령상 의무 이행을 위해 필요한 최소한의 개인정보·신용정보 활용에 대한 동의입니다.',
      detail: [
        '수집 항목: 성명, CI/DI, 생년월일, ISA 계좌번호, 잔액·거래·보유 종목·배당 내역, 챌린지 참여·달성 정보 등.',
        '이용 목적: 챌린지 운영, 보상 산정·지급, 포트폴리오 분석, 원천징수·금융거래 보고 등 법령상 의무 이행.',
        '제공 대상: 제휴 증권사, 국세청, 관계 감독기관(법령 범위 내).',
        '보유 기간: 목적 달성 후 5년 또는 회원이 동의를 철회할 때까지.',
        '회원은 “ISA 계좌 연결 해제” 메뉴로 언제든 동의를 철회할 수 있으며 즉시 계좌 조회·거래 위임이 중단되고 챌린지 참여·보상이 제한됩니다.',
      ],
    },
    {
      title: '보상 처리 안내 수신 동의',
      description:
        '보상 관련 처리 결과 및 지급 안내를 서비스 내 알림으로 수신하기 위한 동의입니다.',
      detail: [
        '회사는 챌린지 달성 여부와 보상 입고 결과, 거래 지연·취소 사실을 서비스 내 알림·팝업으로 통지합니다.',
        '거래 지연·취소 등에 대한 배상 책임은 「전자금융거래법」이 정한 범위 내로 제한됩니다.',
      ],
    },
  ];
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
    const fetchAgreed = () => {
      setIsAgree(false);
    };

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
    console.log('어그리 ~');
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

  return (
    <div className='px-4 py-5 space-y-6'>
      <ChallengeCard onClick={clickChallenge} />
      <QuizBanner streakLabel={streakLabel} completedDates={completedDates} />
      <WeeklyCalendar completedDates={completedDates} />
      {accountInfo && (
        <AccountSummaryCard account={accountInfo} savedTax={savedTax} />
      )}
      <BeginnerGuideCard />
      {/* 약관 개요 모달 */}
      {showModal && (
        <AgreeModal
          onClose={() => setShowModal(false)}
          btnClick={() => handleAgree()}
          reasons={rewardConsentList}
        />
      )}
      {/* 약관 상세 모달 */}
      {/*{showDetailModal && (*/}
      {/*  <AgreeDetailModal*/}
      {/*    onClose={() => setShowDetailModal(false)}*/}
      {/*    btnClick={handleTermsAgree}*/}
      {/*  />*/}
      {/*)}*/}
      약관 동의 했음 모달
      {showConfirmModal && (
        <AgreeConfirmModal onClose={() => setShowConfirmModal(false)} />
      )}
    </div>
  );
}
