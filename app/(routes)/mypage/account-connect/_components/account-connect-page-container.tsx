'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import {
  MessageSquareWarning,
  ShieldCheck,
  SquareCheckBig,
} from 'lucide-react';
import Button from '@/components/button';
import AccountSelectSection from './account-type-select';
import BankSelectSheet from './bank-select-sheet';

const AccountConnectPageContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setHeader('ISA 계좌 연결', 'ISA 계좌를 연결해 주세요');
  }, []);

  const [bank, setBank] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [accountKind, setAccountKind] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [errors, setErrors] = useState({
    bank: '',
    accountType: '',
    accountKind: '',
    accountNumber: '',
  });

  const handleConnectAccount = async () => {
    setConnecting(true);
    const newErrors = {
      bank: bank ? '' : '은행/증권사를 선택해 주세요.',
      accountType: accountType ? '' : '계좌 유형을 선택해 주세요.',
      accountKind: accountKind ? '' : '운용 방식을 선택해 주세요.',
      accountNumber: accountNumber ? '' : '계좌번호를 입력해 주세요.',
    };

    setErrors(newErrors);

    // 하나라도 에러 있으면 중단
    if (Object.values(newErrors).some((msg) => msg !== '')) return;

    try {
      const res = await fetch('/api/isa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: 10008,
          bankCode: bank,
          accountType: accountType,
          accountKind: accountKind,
          accountNum: accountNumber,
          currentBalance: 17000000,
        }),
      });

      if (!res.ok) throw new Error('연결 실패');

      toast.success('계좌 연결이 완료되었습니다!', {
        icon: <SquareCheckBig className='w-5 h-5 text-hana-green' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });

      setTimeout(() => {
        router.push('/mypage'); // 원하는 경로로 변경 가능
      }, 2000);
    } catch (err) {
      console.error('계좌 연결 오류', err);
      setConnecting(false);
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

        <div className='flex flex-col gap-3'>
          <input
            type='text'
            value={bank}
            readOnly
            onClick={() => setShowSheet(true)}
            placeholder='은행/증권사 선택'
            className='rounded-md p-3 text-gray-600 shadow-md text-sm border border-gray-200 cursor-pointer focus:outline-none focus:border-hana-green focus:ring-1 focus:ring-hana-green'
          />

          {errors.bank && (
            <span className='text-xs text-red-500 pl-1'>{errors.bank}</span>
          )}

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
            typeError={errors.accountType}
            kindError={errors.accountKind}
          />

          <input
            type='text'
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder='계좌번호를 입력해 주세요'
            className='rounded-md p-3 text-gray-600 shadow-md text-sm border border-gray-200 cursor-pointer focus:outline-none focus:border-hana-green focus:ring-1 focus:ring-hana-green'
          />
        </div>

        {errors.accountNumber && (
          <p className='text-xs text-red-500 pl-1'>{errors.accountNumber}</p>
        )}

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
          disabled={connecting}
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
