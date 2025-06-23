'use client';

import { useRouter } from 'next/navigation';
import QuizTrophy from '@/public/images/quiz-trophy.svg';
import StarProQuiz from '@/public/images/Star_Pro_Quiz.svg';
import QuestionOption from '@/components/question-option';

interface Selection {
  id: string;
  questionId: string;
  content: string;
}

interface Question {
  id: string;
  content: string;
  selections: Selection[];
  description: string;
}

interface Props {
  question: Question;
  selectedId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  isReviewMode: boolean;
}

export default function ResultPage({
  question,
  selectedId,
  correctAnswerId,
  isCorrect,
  isReviewMode,
}: Props) {
  const router = useRouter();

  return (
    <div className='flex flex-col p-5 space-y-6'>
      {/* 상단 메시지 */}
      <div className='w-full bg-primary rounded-lg p-6 text-center text-white'>
        <QuizTrophy className='mx-auto' />
        <h1 className='text-2xl font-bold mb-2'>퀴즈 완료!</h1>
        <p>
          {isReviewMode
            ? '복기 중입니다'
            : isCorrect
              ? '정답입니다!'
              : '틀렸습니다!'}
        </p>
      </div>

      {/* 문제/선택지 */}
      <div className='w-full h-full p-5 border-gray-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_-2px_4px_rgba(0,0,0,0.15)] rounded-2xl'>
        <div className='text-sm text-gray-500 mb-1'>오늘의 문제</div>
        <h2 className='text-lg font-semibold mb-10'>{question.content}</h2>

        <div className='flex flex-col w-full gap-2 mb-10'>
          {question.selections.map((option) => {
            const isSelected = option.id === selectedId;
            const isAnswer = option.id === correctAnswerId;
            return (
              <QuestionOption
                key={option.id}
                text={option.content}
                active={isAnswer}
                error={isSelected && !isAnswer}
                onClick={() => {}}
              />
            );
          })}
        </div>
        <div className='w-full h-px bg-gray-300 px-4 my-4' />
        <div className='flex gap-1 px-4 text-md font-bold'>
          <div>
            <StarProQuiz />
          </div>
          <div className='px-2 pt-10 '>{question.description}</div>
        </div>
      </div>

      {/* 메인으로 버튼 */}
      <button
        onClick={() => router.push('/main')}
        className='w-full py-4 text-lg font-semibold text-white bg-primary rounded-xl'
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}
