'use client';

import { toast } from 'react-hot-toast';
import Image from 'next/image';
import HanaIcon from '@/public/images/bank-icons/hana-icon';

type Props = {
  account: {
    bankCode:
      | '하나증권'
      | '미래에셋증권'
      | '삼성증권'
      | 'NH투자증권'
      | '한국투자증권'
      | '키움증권'
      | '신한투자증권'
      | 'KB증권';
    accountNum: string;
    currentBalance: string;
    paymentAmount: string;
    accountType: string;
  } | null;
};
const companyMap = {
  하나증권: 'hanaIcon.svg',
  미래에셋증권: 'miraeIcon.png',
  삼성증권: 'samsungIcon.png',
  NH투자증권: 'nhIcon.png',
  한국투자증권: 'koreaIcon.png',
  키움증권: 'kiwoomIcon.png',
  신한투자증권: 'sinhanIcon.png',
  KB증권: 'kbIcon.jpeg',
};

export default function AccountSummaryCard({ account }: Props) {
  if (!account) {
    return (
      <div className='bg-white rounded-2xl p-4 shadow-sm border text-gray-500 text-center'></div>
    );
  }

  const { bankCode, accountNum, currentBalance, accountType } = account;
  const taxBenefit = 12450;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${account.bankCode} ${account.accountNum.replace(/-/g, '')}`
    );
    toast.success('계좌번호가 복사되었어요!');
  };

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-3'>
      <div className='flex justify-between items-start'>
        <div className='flex items-start gap-2'>
          <Image
            src={`/images/securities-icons/${companyMap[bankCode]}`}
            alt={account.bankCode}
            width={24}
            height={24}
            className='rounded-full p-0.5'
          />
          <div className='text-sm'>
            <div className='font-semibold text-gray-800'>
              ISA ({accountType})
            </div>
            <div className='flex items-center gap-2 text-gray-500'>
              {accountNum}
              <button onClick={handleCopy} className='underline text-sm'>
                복사
              </button>
            </div>
          </div>
        </div>
        <div className='text-right text-lg font-bold text-gray-900'>
          {Number(currentBalance).toLocaleString()}{' '}
          <span className='text-base font-normal'>원</span>
        </div>
      </div>

      <div className='mt-4 bg-primary-2 rounded-xl px-4 py-5 flex justify-between items-center'>
        <div className='text-sm'>
          <p className='text-hana-green font-semibold pb-0.5'>
            이번 달 절세 효과
          </p>
          <p className='text-subtitle text-xs'>ISA 계좌 활용으로</p>
        </div>
        <div className='text-right text-sm'>
          <p className='text-hana-green font-semibold text-base pb-0.5'>
            {taxBenefit.toLocaleString()} 원
          </p>
          <p className='text-subtitle text-xs'>만큼 절약했어요!</p>
        </div>
      </div>
    </div>
  );
}
