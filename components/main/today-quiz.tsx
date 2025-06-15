import QuizBannerCharacter from 'public/images/quiz-banner-character.svg';

const TodayQuiz = () => {
  return (
    <div className='bg-primary w-full rounded-lg h-30'>
      <QuizBannerCharacter />
      <div>
        <p>오늘의 금융 퀴즈!</p>
      </div>
    </div>
  );
};

export default TodayQuiz;
