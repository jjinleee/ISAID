'use client';

import Image from 'next/image';
import MenuIcon from '@/public/images/menu-icon';
import { MainHeaderProps } from '@/types/components';

const MainHeader = ({ title, subtitle, onMenuClick }: MainHeaderProps) => {
  return (
    <div className='w-full bg-white px-6 py-3 border-b border-[#D9D9D9]'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-base font-semibold'>{title}</h1>
          {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
        </div>

        <button className='cursor-pointer' onClick={onMenuClick}>
          <MenuIcon />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
