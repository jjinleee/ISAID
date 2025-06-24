'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { AccountIcon } from '@/public/images/isa/account-icon';
import type { Account } from '@/types/my-page';
import { fetchISAInfo } from '@/lib/api/my-page';

const Account = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<Account>({
    id: '',
    userId: '',
    bankCode: '하나증권',
    accountNum: '',
    connectedAt: '',
    currentBalance: 0,
    accountType: '',
  });

  useEffect(() => {
    const fetchISA = async () => {
      const res = await fetchISAInfo();

      if ('error' in res) {
        if (res.error === 'NOT_FOUND') {
          setConnected(false);
          console.log('ISA 계좌가 없습니다.');
        } else {
          console.log('에러 발생: ', res.status || res.error);
        }
      } else {
        setConnected(true);
        setAccount(res);
      }
    };

    fetchISA();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${account.bankCode} ${account.accountNum.replace(/-/g, '')}`
    );
    toast.success('계좌번호가 복사되었어요!');
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

  return (
    <div className='w-full shadow rounded-lg p-4'>
      <div className='flex gap-2'>
        <div className='mt-1'>
          <Image
            src={`/images/securities-icons/${companyMap[account.bankCode]}`}
            alt={account.bankCode}
            width={24}
            height={24}
            className='rounded-full p-0.5'
          />
        </div>
        <div>
          <p className='font-semibold'>
            {account?.bankCode} {account?.accountType} ISA 계좌 [중개형]
          </p>
          <div className='flex gap-2 items-center'>
            <p className='text-gray-4'>{account?.accountNum}</p>
            <p
              className='text-gray-400 underline text-xs cursor-pointer'
              onClick={() => handleCopy()}
            >
              복사
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
