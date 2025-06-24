import StayBoyTest from '@/public/images/star-boy-test.svg';
import Button from '@/components/button';

interface StartProps {
  btnClick: () => void;
}

export const TestStartContainer = ({ btnClick }: StartProps) => {
  return (
    <>
      <div className='flex flex-col gap-4 items-center pt-21'>
        <h1 className='text-2xl font-bold'>ETF 투자 성향 테스트</h1>
        <span className='text-sm font-light text-center text-subtitle'>
          간단한 테스트로 투자 성향을 파악하고,
          <br />
          맞춤형 ETF 테마를 추천받으세요
        </span>
      </div>
      <StayBoyTest />
      <Button
        text='테스트 시작하기'
        thin={false}
        active={true}
        onClick={btnClick}
      />
    </>
  );
};
