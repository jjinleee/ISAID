'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { signOut } from 'next-auth/react';
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
      onClick={onClose} // overlay 클릭 시 닫기
    >
      <div className='absolute inset-0 bg-black opacity-50' />
      <div
        className='relative bg-white rounded-2xl p-6 w-[90%] max-w-md z-10'
        onClick={(e) => e.stopPropagation()} // 내용 클릭 시 닫힘 방지
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
        >
          <X className='w-5 h-5' />
        </button>
        {step === 1 ? (
          <>
            <h2 className='text-lg font-semibold mb-4'>정말 탈퇴하시겠어요?</h2>
            <ul className='text-sm text-gray-600 list-disc pl-5 space-y-2 mb-6'>
              <li>탈퇴 시 계정 정보는 모두 삭제됩니다.</li>
              <li>연결된 금융 데이터도 복구되지 않습니다.</li>
              <li>같은 이메일로 재가입해도 기존 정보는 복구되지 않습니다.</li>
            </ul>
            <div className='flex justify-end gap-2'>
              <button
                className='text-sm text-gray-500 px-4 py-2'
                onClick={onClose}
              >
                취소
              </button>
              <button
                className='bg-hana-red text-white rounded-md px-4 py-2 text-sm'
                onClick={() => setStep(2)}
              >
                탈퇴하기
              </button>
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
                  className='text-sm text-gray-500 px-4 py-2'
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  className='bg-hana-red text-white rounded-md px-4 py-2 text-sm disabled:bg-red-200'
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
