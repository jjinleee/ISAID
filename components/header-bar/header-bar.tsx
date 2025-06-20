'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackIcon from '@/public/images/back-icon';
import MenuIcon from '@/public/images/menu-icon';
import { HeaderBarProps } from '@/types/components';

const HeaderBar = ({ title, subtitle, onMenuClick }: HeaderBarProps) => {
  const router = useRouter();

  return (
    <div className='w-full bg-white px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-6 items-center'>
          <button onClick={() => router.back()} className='cursor-pointer'>
            <BackIcon />
          </button>

          <div className='flex-1'>
            <h1 className='text-base font-semibold'>{title}</h1>
            {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
          </div>
        </div>

        {/*<button onClick={onMenuClick} className='cursor-pointer'>*/}
        {/*  <MenuIcon />*/}
        {/*</button>*/}
        <button></button>
      </div>
    </div>
  );
};

export default HeaderBar;
