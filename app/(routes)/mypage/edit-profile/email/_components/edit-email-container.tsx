'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { validateField } from '@/lib/utils';

interface EMailData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email: boolean;
  password: boolean;
}

export const EditEmailContainer = () => {
  const { setHeader } = useHeader();
  useEffect(() => {
    setHeader('내 정보 수정하기', '이메일 정보 수정');
  }, []);

  const [emailData, setEMailData] = useState<EMailData>({
    email: 'ijin1234@gmail.com',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    email: false,
    password: true,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'password' || field === 'email') {
      setEMailData((prev) => ({ ...prev, [field]: value }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, value, emailData),
      }));
    }
  };

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>이메일 변경</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label>이메일</label>
          <CustomInput
            thin={true}
            type={'email'}
            field='email'
            placeholder={''}
            value={emailData.email}
            onChangeField={handleInputChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label>비밀번호</label>
          <CustomInput
            type='password'
            thin={true}
            placeholder='비밀번호'
            name='password'
            field='password'
            value={emailData.password}
            onChangeField={handleInputChange}
          />
        </div>
      </div>
      <Button
        text={'이메일 변경'}
        thin={false}
        active={!validationErrors.email && !validationErrors.password}
      />
    </div>
  );
};
export default EditEmailContainer;
