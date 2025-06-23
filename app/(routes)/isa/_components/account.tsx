'use client';

import { useEffect, useState } from 'react';
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
      console.log('res fetch', res.data);

      if ('error' in res) {
        if (res.error === 'NOT_FOUND') {
          setConnected(false);
          console.log('ISA 계좌가 없습니다.');
        } else {
          console.log('에러 발생: ', res.status || res.error);
        }
      } else {
        setConnected(true);
        console.log('isa account : ', res);

        setAccount(res);
      }
    };

    fetchISA();
  }, []);

  return (
    <div className='w-full shadow rounded-lg p-4'>
      <div className='flex gap-2'>
        <div className='mt-1'>
          <AccountIcon />
        </div>
        <div>
          <p className='font-semibold'>
            {account?.bankCode} {account?.accountType} ISA 계좌 [중개형]
          </p>
          <div className='flex gap-2 items-center'>
            <p className='text-gray-4'>{account?.accountNum}</p>
            <p className='text-gray-400 underline text-xs cursor-pointer'>
              복사
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
