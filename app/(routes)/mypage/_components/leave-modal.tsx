'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import StarBoyGirlFinger from '@/public/images/my-page/star-boy-girl-finger.svg';
import { CircleAlert, SquareCheckBig, X } from 'lucide-react';
import Input from '@/components/input';
import { leaveUser } from '@/lib/api/my-page';

export default function LeaveModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const leaveClick = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await leaveUser(password);
      console.log('탈퇴 성공:', result);
      toast.success('탈퇴 처리가 완료되었습니다!', {
        icon: <SquareCheckBig className='w-5 h-5 text-hana-green' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });

      setTimeout(() => {
        signOut({ callbackUrl: '/' });
        setLoading(false);
      }, 2000);
    } catch (error: any) {
      setLoading(false);

      console.error('탈퇴 실패:', error.message);
      toast.error('비밀번호를 다시 한번 확인해주세요.', {
        duration: 2000,
        icon: <CircleAlert className='w-5 h-5 text-hana-red' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });
    }
  };

  return (
    <div
      className='fixed inset-0 z-52 flex items-center justify-center'
      onClick={onClose}
    >
      <div className='absolute inset-0 bg-black opacity-50' />
      <div
        className='relative bg-white rounded-2xl p-6 w-[90%] max-w-md z-10'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
        >
          <X className='w-5 h-5' />
        </button>
        {step === 1 ? (
          <>
            <div className='flex flex-col gap-4 items-center'>
              <StarBoyGirlFinger />
              <h2 className='text-lg font-semibold mb-4 text-center'>
                잠깐!
                <br />
                탈퇴하기 전에
                <br />
                확인해주세요
              </h2>

              <ul className='text-sm text-gray-600 list-disc pl-5 space-y-2 mb-6'>
                <li>
                  서비스 탈퇴 시, 연동된 모든 개인정보는 즉시 안전하게
                  삭제됩니다.
                </li>
                <li>
                  이후에는 내 자산 현황 조회, 절세 전략 확인, 맞춤형 투자
                  포트폴리오 제안 등 회원 전용 서비스를 더 이상 이용하실 수
                  없습니다.
                </li>
                <li>
                  또한, 신용정보법 시행령 제18조의6 및 법 제22조의9 제4항,
                  제5항에 따라 회원님께는 데이터 영수증 제공 의무를 성실히
                  이행하고 있습니다.
                </li>
                <li>필요 시, 탈퇴 전 확인해 주세요.</li>
              </ul>
              <div className='w-full flex justify-between gap-4 text-white'>
                <button
                  className='bg-primary px-4 py-2 w-full rounded-md'
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  className='bg-subtitle  rounded-md px-4 py-2 w-full'
                  onClick={() => setStep(2)}
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='flex flex-col gap-4'>
              <h2 className='text-lg font-semibold '>
                비밀번호를 입력해주세요
              </h2>
              <Input
                type='password'
                thin={true}
                placeholder={''}
                value={password}
                onChange={(value) => setPassword(value)}
              />
              <div className='flex justify-end gap-2'>
                <button
                  className='bg-primary px-4 py-2 w-full rounded-md text-white'
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  className='bg-subtitle  rounded-md px-4 py-2 w-full text-white'
                  disabled={!password || loading}
                  onClick={leaveClick}
                >
                  확인
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
