import Calendar from './calendar';
import ProgressBar from './progress-bar';

const ContributionLimit = () => {
  return (
    <div className='flex flex-col p-4 gap-3'>
      <div className='flex w-full justify-between'>
        <p className='font-semibold'>연간 납입한도</p>
        <p className='font-bold'>2,000만원</p>
      </div>
      <ProgressBar current={30} total={100} />
      <div className='flex w-full justify-between'>
        <p className='font-semibold text-sm'>납입 금액: 850만원</p>
        <p className='font-bold'>잔여 한도: 1,150만원</p>
      </div>
      <Calendar />
    </div>
  );
};

export default ContributionLimit;
