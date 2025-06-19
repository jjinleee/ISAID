'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import Button from '@/components/button';
import {
  formatProfilePHN,
  formatProfileRRN,
  maskProfileEmail,
} from '@/lib/utils';

export const ProfileContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  useEffect(() => {
    setHeader('내 정보 수정하기', '당신의 금융 발자취를 확인해보세요');
  }, []);
  const [name, setName] = useState(''); // 수정 가능하게
  const [engName, setEngName] = useState(''); // 수정 가능하게
  const [rrn, setRRN] = useState('');
  const [phone, setPhone] = useState(''); // 수정 가능하게
  const [email, setEmail] = useState(''); // 수정 가능하게
  const [address, setAddress] = useState(''); // 수정 가능하게
  const [telNo, setTelNo] = useState(''); // 수정 가능하게
  useEffect(() => {
    setName('이진');
    setEngName('Lee Jin');
    setRRN(formatProfileRRN('000207-3123456'));
    setPhone(formatProfilePHN('010-1234-5678'));
    setEmail(maskProfileEmail('ijin1234@gmail.com'));
    setAddress('경기도 용인시 수지구');
    setTelNo(formatProfilePHN('031-493-1234'));
  }, []);

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-4'>
      <div className='flex justify-between border-b border-b-gray-2 pb-4'>
        <h1 className='text-xl font-semibold'>기본 정보</h1>
        <div
          className='flex justify-end items-center cursor-pointer'
          onClick={() => router.push('/mypage/edit-profile')}
        >
          <span className='text-sm'>수정하기 </span>
          <ArrowIcon
            direction='right'
            color='#c9c9c9'
            className='w-4 h-4'
            viewBox='0 0 11 28'
          />
        </div>
      </div>

      <div className='pb-4 border-b border-b-gray-2 flex flex-col gap-3'>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>이름</span>
          <span>{name}</span>
        </div>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>영문이름</span>
          <span>{engName}</span>
        </div>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>주민등록번호</span>
          <span>{rrn}</span>
        </div>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>휴대폰번호</span>
          <span>{phone}</span>
        </div>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>e-mail</span>
          <span>{email}</span>
        </div>
      </div>
      <h1 className='pb-4 border-b border-b-gray-2 text-xl font-semibold'>
        자택 정보
      </h1>
      <div className='pb-4 border-b border-b-gray-2 flex flex-col gap-3'>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>자택주소</span>
          <span>{address}</span>
        </div>
        <div className='w-full flex justify-between items-center'>
          <span className='text-subtitle'>전화번호</span>
          <span>{telNo}</span>
        </div>
      </div>
      {/*<div className='flex justify-end items-center cursor-pointer'>*/}
      {/*  <span className='text-sm'>수정하기 </span>*/}
      {/*  <ArrowIcon*/}
      {/*    direction='right'*/}
      {/*    color='#c9c9c9'*/}
      {/*    className='w-4 h-4'*/}
      {/*    viewBox='0 0 11 28'*/}
      {/*  />*/}
      <div className='flex flex-col gap-2'>
        <Button text={'탈퇴하기'} thin={false} active={false} />
      </div>
    </div>
  );
};
export default ProfileContainer;
