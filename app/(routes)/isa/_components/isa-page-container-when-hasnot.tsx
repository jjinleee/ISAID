'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import SecurePinModal from '@/components/secure-pin-modal';
import { verifyPin } from '@/lib/api/my-page';
import { isPinVerified, setPinVerified } from '@/lib/session';

const features = [
  {
    title: '내 투자 성과를 한눈에 확인',
    description:
      '월별 수익률을 자동으로 계산해줘서, 언제 얼마나 수익이 났는지 쉽게 파악할 수 있어요',
  },
  {
    title: '보유 내역이 깔끔하게 정리돼요',
    description:
      '국내외 ETF는 물론, 채권·펀드·ELS·일반 상품도 구분해서 보여줘요',
  },
  {
    title: '상품별 거래 내역도 캘린더로 빠짐없이 확인 가능',
    description:
      '어떤 상품을 언제 얼마나 매수/매도했는지, 세세하게 확인할 수 있어요',
  },
  {
    title: '투자 리포트를 자동으로 만들어줘요',
    description:
      '월초·월말 기준 데이터를 바탕으로 나만의 투자 리포트를 자동 생성해줘요',
  },
  {
    title: '절세 성과로 장기 투자를 응원해요',
    description:
      '절약한 세금과 예측 절감액을 일상 속 금액으로 체감하고, 만기까지 꾸준히 투자할 수 있도록 동기부여해줘요',
  },
];

export default function ISAPageContainerWhenHasnot() {
  const { setHeader } = useHeader();
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setHeader('ISA', '이제 ISA도 한눈에, 손쉽게');
  }, []);

  const handleVerifyPin = async (pin: string) => {
    const res = await verifyPin(pin);

    if (!res.success) {
      toast.error('비밀번호가 올바르지 않습니다.');
      return false;
    }
    setPinVerified();
    setTimeout(() => {
      setModalOpen(false);
      router.push('/mypage');
    }, 300);
    return true;
  };

  const userClick = () => {
    if (pathname === '/mypage') return;

    if (isPinVerified()) {
      router.push('/mypage');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className='max-w-xl mx-auto py-16 px-4'>
      {/* 안내 캐릭터 + 메시지 */}
      <div className='flex flex-col items-center'>
        <Image
          src='/images/isa/feature-guide-character.svg'
          width={100}
          height={200}
          alt='guide'
        />
        <p className='mt-6 text-center text-lg font-semibold'>
          이 페이지의 기능들을 이용하려면 <br />
          ISA 계좌를 먼저 연결해 주세요!
        </p>
      </div>

      {/* 토스 느낌의 깔끔한 리스트 */}
      <ul className='mt-12 space-y-6 mb-10'>
        {features.map(({ title, description }, idx) => (
          <li key={idx} className='flex'>
            {/* 좌측 Green Dot */}
            <div className='flex-shrink-0 mt-1.5'>
              <span className='block w-3 h-3 bg-hana-green rounded-full' />
            </div>
            <div className='ml-4'>
              <h3 className='text-base font-medium text-gray-900'>{title}</h3>
              <p className='mt-1 text-sm text-gray-600'>{description}</p>
            </div>
          </li>
        ))}
      </ul>

      <Button
        type='submit'
        thin={false}
        active={true}
        text={'연결하러 가기'}
        onClick={userClick}
      />

      <SecurePinModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleVerifyPin}
      />
    </div>
  );
}
