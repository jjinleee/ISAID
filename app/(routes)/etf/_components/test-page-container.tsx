'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import QuestionOption from '@/components/question-option';
import ProgressBar from '../_components/progress-bar';
import { TestEndContainer } from '../_components/test-end-container';
import { TestStartContainer } from '../_components/test-start-container';

type Question = {
  id: number;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: '현재 연금 계좌에서 투자하고 있나요?',
    options: ['1,000 만원', '2,000 만원', '3,000 만원', '4,000 만원'],
  },
  {
    id: 2,
    question: '한 달 투자 가능 금액은 얼마인가요?',
    options: ['10 만원', '30 만원', '50 만원', '100 만원 이상'],
  },
];

const TestContainer = () => {
  const { setHeader } = useHeader();
  const [step, setStep] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const handleOptionClick = (questionIndex: number, optionIndex: number) => {
    const newSelections = [...selectedOptions];
    newSelections[questionIndex] = optionIndex;
    setSelectedOptions(newSelections);
  };

  useEffect(() => {
    setHeader('ETF 투자 성향 테스트', '당신의 투자 테스트 성향을 알아보세요');
  }, []);

  const renderTestStep = () => {
    const answeredCount = selectedOptions.filter((val) => val !== null).length;
    const isAllAnswered = selectedOptions.every((v) => v !== null);

    return (
      <div className='flex flex-col gap-10 items-center w-full'>
        <ProgressBar current={answeredCount} total={questions.length} />

        {questions.map((q, qIdx) => (
          <div
            key={q.id}
            className='flex flex-col border border-gray-2 rounded-2xl w-full p-5 gap-5'
          >
            <div className='rounded-2xl border-gray-2 p-1.5 text-sm'>
              Q. {qIdx + 1}/{questions.length}
            </div>
            <p className='w-full font-bold'>{q.question}</p>
            {q.options.map((option, oIdx) => (
              <QuestionOption
                key={oIdx}
                text={option}
                active={selectedOptions[qIdx] === oIdx}
                onClick={() => handleOptionClick(qIdx, oIdx)}
              />
            ))}
          </div>
        ))}

        <Button
          text='제출하기'
          thin={false}
          active={true}
          disabled={!isAllAnswered}
          onClick={() => {
            console.log('최종 응답:', selectedOptions);
            setStep(2);
          }}
        />
      </div>
    );
  };

  return (
    <div className='flex flex-col px-6 py-10'>
      <div className='flex flex-col gap-9 items-center'>
        {step === 0 && <TestStartContainer btnClick={() => setStep(1)} />}

        {step === 1 && renderTestStep()}

        {step === 2 && <TestEndContainer btnClick={() => setStep(0)} />}
      </div>
    </div>
  );
};

export default TestContainer;
