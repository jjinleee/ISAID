'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useHeader } from '@/context/header-context';
import { MessageSquareWarning, ShieldCheck } from 'lucide-react';
import Button from '@/components/button';
import AccountSelectSection from './account-type-select';
import BankSelectSheet from './bank-select-sheet';

const AccountConnectPageContainer = () => {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('ISA 계좌 연결', 'ISA 계좌를 연결해 주세요');
  }, []);

  const [bank, setBank] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [accountKind, setAccountKind] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleConnectAccount = async () => {
    try {
      const res = await fetch('/api/account/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank, accountType, accountKind, accountNumber }),
      });

      if (!res.ok) throw new Error('연결 실패');

      const data = await res.json();

      console.log('연결 성공!', data);
    } catch (err) {
      console.error('계좌 연결 오류', err);
    }
  };

  return (
    <div className='px-5 pt-21 pb-5 flex flex-col gap-8'>
      <div className='flex shadow rounded-lg p-5'>
        <ShieldCheck className='w-12 sm:w-10 sm:h-6 text-hana-green mr-2 relative top-0.5' />
        <div>
          <p className='font-semibold'>안전한 계좌 연결</p>
          <p className='text-sm'>
            금융위원회 인증 오픈뱅킹을 통해 안전하게 계좌 정보를 가져옵니다.
            비밀번호나 보안카드 정보는 저장되지 않습니다.
          </p>
        </div>
      </div>

      <div className='flex flex-col shadow p-5 gap-3 rounded-lg'>
        <p className='text-lg font-semibold'>계좌 정보를 입력해 주세요</p>
        <p className='text-sm'>기존 ISA 계좌를 연결해 주세요.</p>

        <div className='flex flex-col gap-5'>
          <input
            type='text'
            value={bank}
            readOnly
            onClick={() => setShowSheet(true)}
            placeholder='은행/증권사 선택'
            className='rounded-md p-3 shadow-md text-sm border border-gray-200 cursor-pointer focus:outline-none focus:border-hana-green focus:ring-1 focus:ring-hana-green'
          />

          <BankSelectSheet
            visible={showSheet}
            onClose={() => setShowSheet(false)}
            onSelect={(selected) => setBank(selected)}
          />

          <AccountSelectSection
            type={accountType}
            kind={accountKind}
            onChangeType={(value) => setAccountType(value)}
            onChangeKind={(value) => setAccountKind(value)}
          />

          <input
            type='text'
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder='계좌번호를 입력해 주세요'
            className='rounded-md p-3 shadow-md text-sm border border-gray-200 cursor-pointer focus:outline-none focus:border-hana-green focus:ring-1 focus:ring-hana-green'
          />
        </div>

        <div className='flex gap-2 shadow bg-[#FFF4C5] mt-5 rounded-lg p-5 mb-5'>
          <MessageSquareWarning className='text-[#B8860B] relative top-0.5' />
          <div className='flex flex-col gap-2'>
            <div className='text-[#B8860B]'>
              <p className='font-semibold'>주의사항</p>
              <p className='text-sm'>• ISA 계좌만 연결이 가능합니다.</p>
              <p className='text-sm'>• 본인 명의 계좌만 연결할 수 있습니다.</p>
              <p className='text-sm'>• 휴면계좌는 연결이 제한될 수 있습니다.</p>
            </div>
          </div>
        </div>

        <Button
          type='submit'
          thin={false}
          active={true}
          text={'계좌 연결하기'}
          onClick={handleConnectAccount}
        />
      </div>

      <div className='w-full rounded-xl border border-gray-100 shadow-sm p-5 bg-white'>
        {/* 상단 아이콘 + 텍스트 */}
        <div className='flex items-center gap-2 mb-4'>
          <Image
            src='/images/my-page/service.svg'
            alt='service'
            width={20}
            height={20}
          />
          <p className='text-[#2EBF72] font-semibold'>
            연결 후 이용 가능한 서비스
          </p>
        </div>

        {/* 항목 리스트 */}
        <div className='flex flex-col gap-2'>
          {[
            '실시간 잔액 및 거래내역 조회',
            '자동 절세 효과 계산',
            '맞춤형 투자 상품 추천',
          ].map((text, idx) => (
            <div
              key={idx}
              className='flex items-center gap-2 p-3 rounded-md bg-[#f9fbfc]'
            >
              <div className='w-2 h-2 rounded-full bg-[#2EBF72]' />
              <p className='text-sm text-gray-800'>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountConnectPageContainer;
