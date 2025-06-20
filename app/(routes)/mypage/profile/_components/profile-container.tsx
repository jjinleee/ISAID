'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import ArrowIcon from '@/public/images/arrow-icon';
import ModalWrapper from '@/utils/modal';
import Button from '@/components/button';
import { fetchMyInfo } from '@/lib/api/my-page';
import { formatProfilePHN, maskProfileEmail } from '@/lib/utils';
import LeaveModal from '../../_components/leave-modal';

export const ProfileContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();

  const [name, setName] = useState('');
  const [engName, setEngName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [telNo, setTelNo] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetchMyInfo();
      setName(res.name);
      setEngName(res.engName);
      setPhone(formatProfilePHN(res.phone));
      setEmail(maskProfileEmail(res.email));
      setAddress(res.address);
      setTelNo(formatProfilePHN(res.telno));
    };
    fetchMe();
    setHeader('내 정보 수정하기', '당신의 금융 발자취를 확인해보세요');
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
            color='#000000'
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
      <div className='flex flex-col gap-2'>
        <Button
          text={'탈퇴하기'}
          thin={false}
          active={false}
          onClick={() => setShowLeaveModal(true)}
        />
      </div>
      {showLeaveModal && (
        <ModalWrapper headerOnly={false}>
          <LeaveModal onClose={() => setShowLeaveModal(false)} />
        </ModalWrapper>
      )}
    </div>
  );
};
export default ProfileContainer;
