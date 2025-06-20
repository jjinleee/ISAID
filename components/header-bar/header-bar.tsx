'use client';

import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import BackIcon from '@/public/images/back-icon';
import User from '@/public/images/common/user.svg';
import { HeaderBarProps } from '@/types/components';

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
      </div>
    </div>
  );
};

export default HeaderBar;
