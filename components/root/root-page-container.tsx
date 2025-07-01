'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '../button';

const RootPageContainer = () => {
  const router = useRouter();
  return (
    <div className='w-scree h-screen flex items-center justify-center max-w-[768px] flex-col p-5 gap-8'>
      <div className='w-full flex flex-col gap-6 items-center'>
        <Image
          src='/images/my-page/star-boy-girl.svg'
          alt='hana character'
          width={238}
          height={121}
        />

        <div className='flex flex-col text-center'>
          <p className='text-[#33C4A8] font-bold text-2xl'>ISAID</p>
          <p className='text-subtitle'>I SAVE SMART, INVEST DAILY!</p>
        </div>
      </div>
      <div className='w-full flex flex-col gap-4'>
        <Button
          text='로그인'
          thin={false}
          active={true}
          onClick={() => router.push('/login')}
          className='text-lg px-6 py-3'
        />
        <Button
          text='회원가입'
          thin={false}
          active={true}
          onClick={() => router.push('/register')}
          className='text-lg px-6 py-3'
        />
      </div>
    </div>
  );
};

export default RootPageContainer;
