'use client';

import { toast } from 'react-hot-toast';
import HanaIcon from '@/public/images/bank-icons/hana-icon';

export default function AccountSummaryCard() {
  const accountNumber = '592-910508-29670';
  const balance = 776_539;
  const taxBenefit = 12_450;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    toast.success('계좌번호가 복사되었어요!');
  };

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-3'>
      <div className='flex justify-between items-start'>
        {/* 좌측: 아이콘 + 텍스트 묶음 */}
        <div className='flex items-start gap-2'>
          {/* 아이콘 */}
          <HanaIcon className='w-5 h-5 rounded-full mt-1 border border-gray-3' />
          {/* <div className='w-5 h-5 bg-primary-100 rounded-full mt-1' /> */}

          {/* 텍스트 묶음 */}
          <div className='text-sm'>
            <div className='font-semibold text-gray-800'>저축예금</div>
            <div className='flex items-center gap-2 text-gray-500'>
              592-910508-29670
              <button onClick={handleCopy} className='underline text-sm'>
                복사
              </button>
            </div>
          </div>
        </div>

        {/* 우측: 잔액 */}
        <div className='text-right text-lg font-bold text-gray-900'>
          {balance.toLocaleString()}{' '}
          <span className='text-base font-normal'>원</span>
        </div>
      </div>
      {/* 절세 효과 카드 */}
      <div className='mt-4 bg-primary-2 rounded-xl px-4 py-5 flex justify-between items-center'>
        <div className='text-sm'>
          <p className='text-hana-green font-semibold pb-0.5'>
            이번 달 절세 효과
          </p>
          <p className='text-subtitle text-xs'>ISA 계좌 활용으로</p>
        </div>
        <div className='text-right text-sm'>
          <p className='text-hana-green  font-semibold text-base pb-0.5'>
            {taxBenefit.toLocaleString()} 원
          </p>
          <p className='text-subtitle text-xs'>만큼 절약했어요!</p>
        </div>
      </div>
    </div>
  );
}
