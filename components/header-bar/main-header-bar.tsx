'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MenuIcon from '@/public/images/menu-icon';
import { MainHeaderProps } from '@/types/components';
import SecurePinModal from '@/components/secure-pin-modal';

const MainHeader = ({ title, subtitle, onMenuClick }: MainHeaderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const handleVerifyPin = async (pin: string) => {
    try {
      if (pin !== '123456') {
        toast.error('비밀번호가 올바르지 않습니다.');
        return false;
      }
      console.log('gmlgml');

      toast.success('인증에 성공하였습니다.', {
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });
      router.push('/mypage');
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

        <button className='cursor-pointer' onClick={onMenuClick}>
          <MenuIcon />
        </button>
        <div onClick={() => setModalOpen(true)}>gmlgmlgmlg</div>
        <SecurePinModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleVerifyPin}
        />
      </div>
    </div>
  );
};

export default MainHeader;
