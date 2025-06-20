'use client';

import User from '@/public/images/common/user.svg';
import { MainHeaderProps } from '@/types/components';

const MainHeader = ({ title, subtitle, onMenuClick }: MainHeaderProps) => {
  return (
    <div className='w-full bg-white px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-base font-semibold'>{title}</h1>
          {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
        </div>

        <button onClick={onMenuClick} className='cursor-pointer'>
          <User />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
