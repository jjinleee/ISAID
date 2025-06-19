'use client';

import { useEffect } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import Button from '@/components/button';

interface Props {
  session: Session;
}

export const EditProfileContainer = ({ session }: Props) => {
  const { setHeader } = useHeader();
  useEffect(() => {
    setHeader('내 정보 수정하기', '회원정보를 확인하고 수정할 수 있어요');
  }, []);

  console.log('session : ', session);

  const router = useRouter();
  const targetList = [
    { target: '이름', path: 'name' },
    { target: '전화번호', path: 'phone' },
    { target: '자택 정보', path: 'home' },
    { target: '이메일', path: 'email' },
    { target: '비밀번호', path: 'password' },
  ];

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='pb-4 border-b border-b-gray-2 text-xl font-semibold'>
        내 정보 수정
      </h1>
      <div className='flex flex-col gap-6'>
        {targetList.map((item, idx) => (
          <div
            key={idx}
            className='flex justify-between cursor-pointer'
            onClick={() => router.push(`/mypage/edit-profile/${item.path}`)}
          >
            <span>{item.target} 변경</span>
            <ArrowIcon
              direction='right'
              color='#000000'
              className='w-5 h-5'
              viewBox='0 0 11 34'
            />
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-2'>
        <Button text={'탈퇴하기'} thin={false} active={false} />
      </div>
    </div>
  );
};
export default EditProfileContainer;
