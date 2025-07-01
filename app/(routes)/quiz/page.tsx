import { Suspense } from 'react';
import QUIZPageContainer from './_components/quiz-page-container';

export default function QUIZPage() {
  return (
    <Suspense
      fallback={<div className='p-5'>퀴즈 페이지를 준비 중입니다...</div>}
    >
      <QUIZPageContainer />
    </Suspense>
  );
}
