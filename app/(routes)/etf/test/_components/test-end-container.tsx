import StayBoyTest from '@/public/images/star-boy-test.svg';
import Button from '@/components/button';

interface StartProps {
  btnClick: () => void;
}

export const TestEndContainer = ({ btnClick }: StartProps) => {
  return (
    <>
      <div className='flex flex-col gap-4 items-center'>
        <h1 className='text-2xl font-bold'>ETF 투자 성향 테스트 결과</h1>
        <span className='text-sm font-light text-center text-subtitle'>
          OO님의 투자 성향 테스트 결과는 다음과 같습니다
        </span>
      </div>
      <StayBoyTest />
      <Button
        text='테스트 다시 하기'
        thin={false}
        active={true}
        onClick={btnClick}
      />
    </>
  );
};
