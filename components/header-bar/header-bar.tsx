'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import BackIcon from '@/public/images/back-icon';
import User from '@/public/images/common/user.svg';
import { HeaderBarProps } from '@/types/components';
import SecurePinModal from '@/components/secure-pin-modal';

const HeaderBar = ({ title, subtitle, onMenuClick }: HeaderBarProps) => {
  const router = useRouter();
  const { onBack } = useHeader();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const handleVerifyPin = async (pin: string): Promise<boolean> => {
    try {
      if (pin !== '123456') {
        toast.error('비밀번호가 올바르지 않습니다.');
        return false;
      }

      toast.success('인증에 성공하였습니다.', {
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });

      setTimeout(() => {
        router.push('/mypage');
      }, 500);

      return true;
    } catch (err) {
      toast.error('서버 오류가 발생했습니다.');
      return false;
    }
  };

  return (
    <div className='w-full bg-white px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-6 items-center'>
          <button onClick={handleBack} className='cursor-pointer'>
            <BackIcon />
          </button>

          <div className='flex-1'>
            <h1 className='text-base font-semibold'>{title}</h1>
            {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
          </div>
        </div>

        <button onClick={onMenuClick} className='cursor-pointer'>
          <User />
        </button>
        <div onClick={() => setModalOpen(true)}>간편비밀번호</div>
        <SecurePinModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleVerifyPin}
        />
      </div>
    </div>
  );
};

export default HeaderBar;
