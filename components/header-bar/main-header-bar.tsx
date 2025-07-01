'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import User from '@/public/images/common/user.svg';
import MenuIcon from '@/public/images/menu-icon';
import { MainHeaderProps } from '@/types/components';

const MainHeader = ({ title, subtitle, onMenuClick }: MainHeaderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
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
        <div className='flex flex-col'>
          <h1 className='text-base font-semibold'>{title}</h1>
          {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
        </div>

        <button onClick={onMenuClick} className='cursor-pointer'>
          <User />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
