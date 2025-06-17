'use client';

import { useEffect, useRef, useState } from 'react';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import QuestionOption from '@/components/question-option';
import ProgressBar from './progress-bar';
import { TestEndContainer } from './test-end-container';
import { TestStartContainer } from './test-start-container';

// 총 16문제: 앞 6문제(front), 뒤 10문제(back)
// step: 0=시작, 1=전반부, 2=후반부, 3=끝
// 완료 전 클릭 시 첫 미응답 문항으로 스크롤 & 포커싱

type Question = {
  id: number;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: '수익은 크지만 손해 볼 수도 있는 상품이 있다면?',
    options: [
      '무조건 안 해요',
      '망설여져요',
      '상황 봐서 해볼 수도 있어요',
      '조금 위험해도 괜찮아요',
      '해볼래요! 수익이 크다니까요',
    ],
  },
  {
    id: 2,
    question: '내가 투자한 자산이 20% 떨어졌어요. 어떻게 할까요?',
    options: [
      '바로 다 팔아요',
      '너무 걱정돼서 손 못 대요',
      '기다려봐요',
      '분석하고 일부 사볼 수도 있어요',
      '싸졌으니 더 사요',
    ],
  },
  {
    id: 3,
    question: '투자금이 갑자기 10만 원 줄었을 때 기분은?',
    options: [
      '불안해서 잠이 안 와요',
      '자주 확인하게 돼요',
      '당황스럽긴 하지만 괜찮아요',
      '괜찮아요, 다시 오를 거예요',
      '신경 안 써요',
    ],
  },
  {
    id: 4,
    question: '투자로 어느 정도 수익을 원하시나요?',
    options: [
      '손해만 안 보면 돼요',
      '은행보다 조금만 더',
      '적당한 수익이면 만족',
      '많이 벌고 싶어요',
      '크게 벌고 싶어요',
    ],
  },
  {
    id: 5,
    question: '지금까지 해본 투자는?',
    options: [
      '전혀 없어요',
      '예금/적금만 해봤어요',
      '펀드 같은 간접투자만',
      '주식이나 ETF 조금 해봤어요',
      '이것저것 많이 해봤어요',
    ],
  },
  {
    id: 6,
    question: '돈 관련 뉴스나 영상, 자주 보시나요?',
    options: [
      '거의 안 봐요',
      '제목만 가끔 봐요',
      '관심 있을 때만 봐요',
      '자주 챙겨봐요',
      '매일 찾아봐요',
    ],
  },
  {
    id: 7,
    question: '나는 친구들 사이에서 어떤 사람인가?',
    options: [
      '주변 모두를 챙기는 믿음직한 친구',
      '새로운 트렌드를 빠르게 찾는 친구',
      '독특한 분야에 몰입하는 친구',
    ],
  },
  {
    id: 8,
    question: '선호하는 여행 스타일은?',
    options: [
      '편안한 호텔이나 리조트',
      '독특한 도시 탐방 및 인프라 경험',
      '현지인처럼 장기적으로 머무는 여행',
    ],
  },
  {
    id: 9,
    question: '관심있는 유튜브 콘텐츠는?',
    options: [
      '현실적이고 실용적인 정보',
      '미래 기술 및 트렌드 소개',
      '일상 리뷰 및 생활 관련 브이로그',
    ],
  },
  {
    id: 10,
    question: '새로운 앱 출시 반응은?',
    options: [
      '안정적이고 유명한 앱 선택',
      '혁신적이고 트렌디한 앱 선택',
      '꼼꼼히 분석하여 앱 사용',
    ],
  },
  {
    id: 11,
    question: '영화/드라마 장르 선호는?',
    options: [
      '힐링, 로맨스, 코미디',
      '현실적, 역사적 다큐멘터리',
      '액션, 서스펜스',
    ],
  },
  {
    id: 12,
    question: '가장 끌리는 취미활동/부업은?',
    options: [
      '온라인으로 집에서 쉽게 수익 창출',
      '오래 걸리더라도 중장기 산업 관련 공부나 사업',
      '트렌디한 취미 클래스 경험',
    ],
  },
  {
    id: 13,
    question: '하루 일과를 마치고 잠들기 전 나는?',
    options: [
      '일과를 분석적으로 정리하고 휴식',
      '내일을 위한 새로운 아이디어 구상',
      '오늘 하루를 돌아보며 편안하게 쉬기',
    ],
  },
  {
    id: 14,
    question: '투자 스타일을 한 문장으로 표현한다면?',
    options: [
      '안정적이고 그룹 중심 투자',
      '모험과 리스크를 즐기는 투자',
      '내재적 가치와 실물 경제 분석 투자',
    ],
  },
  {
    id: 15,
    question: '내 성격과 비슷한 취미활동은?',
    options: [
      '팀/그룹 활동 선호',
      '경제·금융 관련 분석 활동',
      '제조·산업 기반 프로젝트 참여',
    ],
  },
  {
    id: 16,
    question: '내가 중요하게 생각하는 투자 가치는?',
    options: [
      '산업 전체 흐름 이해',
      '실물경제 기반 안정적 성장',
      '리스크를 통한 차별화 수익 추구',
    ],
  },
];
const FRONT_COUNT = 6;
export default function TestContainer() {
  const { setHeader } = useHeader();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setHeader('ETF 투자 성향 테스트', '당신의 투자 성향을 알아보세요');
  }, []);

  const handleOptionClick = (idx: number, opt: number) => {
    setFocusedIdx(null);
    setSelectedOptions((prev) => {
      const copy = [...prev];
      copy[idx] = opt;
      return copy;
    });
  };

  const isGroupComplete = (start: number, count: number) =>
    questions
      .slice(start, start + count)
      .every((_, i) => selectedOptions[start + i] !== null);

  const scrollAndFocus = (idx: number) => {
    const el = questionRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      setFocusedIdx(idx);
    }
  };

  const handleNext = () => {
    if (isGroupComplete(0, FRONT_COUNT)) {
      setStep(2);
    } else {
      const missing = selectedOptions
        .slice(0, FRONT_COUNT)
        .findIndex((v) => v === null);
      if (missing >= 0) scrollAndFocus(missing);
    }
  };

  const handleSubmit = () => {
    const backCount = questions.length - FRONT_COUNT;
    if (isGroupComplete(FRONT_COUNT, backCount)) {
      setStep(3);
    } else {
      const missing = selectedOptions
        .slice(FRONT_COUNT)
        .findIndex((v) => v === null);
      const idx = FRONT_COUNT + missing;
      if (missing >= 0) scrollAndFocus(idx);
    }
  };

  const renderGroup = (start: number, count: number) =>
    questions.slice(start, start + count).map((q, i) => {
      const globalIdx = start + i;
      return (
        <div
          key={q.id}
          ref={(el) => {
            questionRefs.current[globalIdx] = el;
          }}
          tabIndex={-1}
          className={`flex flex-col border rounded-2xl w-full p-5 gap-5 transition-ring ${
            focusedIdx === globalIdx ? 'ring-2 ring-red-500' : 'border-gray-2'
          }`}
        >
          <div className='rounded-2xl border-gray-2 p-1.5 text-sm'>
            Q. {i + 1}/{count}
          </div>
          <p className='w-full font-bold'>{q.question}</p>
          {q.options.map((opt, oi) => (
            <QuestionOption
              key={oi}
              text={opt}
              active={selectedOptions[globalIdx] === oi}
              onClick={() => handleOptionClick(globalIdx, oi)}
            />
          ))}
        </div>
      );
    });

  return (
    <div className='flex flex-col gap-10 items-center w-full'>
      {/* 상단 고정 ProgressBar */}
      {(step === 1 || step === 2) && (
        <div className='!fixed max-w-[720px] top-17 w-full bg-white pt-2 m'>
          <ProgressBar
            current={
              step === 1
                ? selectedOptions
                    .slice(0, FRONT_COUNT)
                    .filter((v) => v !== null).length
                : selectedOptions.slice(FRONT_COUNT).filter((v) => v !== null)
                    .length
            }
            total={step === 1 ? FRONT_COUNT : questions.length - FRONT_COUNT}
          />
        </div>
      )}

      {/* 스크롤 가능한 질문 영역 */}
      <div className='overflow-y-auto w-full h-full px-6'>
        <div className='flex flex-col gap-9 items-center'>
          {step === 0 && <TestStartContainer btnClick={() => setStep(1)} />}
          {step === 1 && renderGroup(0, FRONT_COUNT)}
          {step === 2 &&
            renderGroup(FRONT_COUNT, questions.length - FRONT_COUNT)}
          {step === 3 && <TestEndContainer btnClick={() => setStep(0)} />}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      {(step === 1 || step === 2) && (
        <div className='!fixed max-w-[720px] top-204 w-full bg-white pt-2 m'>
          <Button
            thin={false}
            text={step === 1 ? '다음' : '제출하기'}
            active={true}
            onClick={step === 1 ? handleNext : handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
