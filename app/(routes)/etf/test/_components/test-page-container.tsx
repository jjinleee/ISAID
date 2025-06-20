'use client';

import { useEffect, useRef, useState } from 'react';
import { useHeader } from '@/context/header-context';
import { questions } from '@/data/etf-test';
import Button from '@/components/button';
import QuestionOption from '@/components/question-option';
import { submitEtfMbtiResult } from '@/lib/api/etf-test';
import { convertToEnum, getEtfResult } from '@/lib/test/utils';
import ProgressBar from './progress-bar';
import { TestEndContainer } from './test-end-container';
import { TestStartContainer } from './test-start-container';

export default function TestContainer() {
  const FRONT_COUNT = 6;
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
    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'center' });
    el.focus();
    setFocusedIdx(idx);
  };

  const handleNext = () => {
    if (isGroupComplete(0, FRONT_COUNT)) {
      setStep(2);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    } else {
      const missing = selectedOptions
        .slice(0, FRONT_COUNT)
        .findIndex((v) => v === null);
      if (missing >= 0) scrollAndFocus(missing);
    }
  };

  const handleSubmit = async () => {
    const backCount = questions.length - FRONT_COUNT;
    if (isGroupComplete(FRONT_COUNT, backCount)) {
      const { riskType, topTypes } = getEtfResult(selectedOptions);
      const investType = convertToEnum(riskType);

      try {
        await submitEtfMbtiResult({
          investType,
          preferredCategories: topTypes,
        });
        setStep(3);
      } catch (error: any) {
        console.error('요청 실패:', error);
        alert(error?.message || '알 수 없는 오류가 발생했습니다.');
      }
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
      {(step === 1 || step === 2) && (
        <div className='!fixed max-w-[720px] top-17 w-full bg-white pt-2 px-6'>
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

      <div className='overflow-y-auto w-full h-full px-6 pt-13 pb-18'>
        <div className='flex flex-col gap-9 items-center'>
          {step === 0 && <TestStartContainer btnClick={() => setStep(1)} />}
          {step === 1 && renderGroup(0, FRONT_COUNT)}
          {step === 2 &&
            renderGroup(FRONT_COUNT, questions.length - FRONT_COUNT)}
          {step === 3 && (
            <TestEndContainer
              btnClick={() => setStep(0)}
              answers={selectedOptions}
            />
          )}
        </div>
      </div>

      {(step === 1 || step === 2) && (
        <div className='!fixed max-w-[720px] bottom-18 w-full bg-white pb-3 px-6'>
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
