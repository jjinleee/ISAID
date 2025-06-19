'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { submitUserUpdate } from '@/app/(routes)/mypage/edit-profile/utils';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { fetchMyInfo } from '@/lib/api/my-page';
import { validateField } from '@/lib/utils';

interface EMailData {
  email: string;
}

interface ValidationErrors {
  email: boolean;
}

export const EditEmailContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [emailData, setEMailData] = useState<EMailData>({
    email: '',
  });

  useEffect(() => {
    setHeader('내 정보 수정하기', '자택 정보 수정');
    const fetchMe = async () => {
      const res = await fetchMyInfo();

      setEMailData({
        email: res.email || '',
      });
    };
    fetchMe();
  }, []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    email: false,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'email') {
      setEMailData((prev) => ({ ...prev, [field]: value }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, value, emailData),
      }));
    }
  };
  const submitData = async () => {
    const data = {
      email: emailData.email,
    };
    setLoading(true);
    await submitUserUpdate({
      data: data,
      onSuccess: () => router.back(),
      onFinally: () => setLoading(false),
    });
  };
  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>이메일 변경</h1>
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
      <Button
        text={'이메일 변경'}
        thin={false}
        active={!validationErrors.email}
        onClick={submitData}
        disabled={loading}
      />
    </div>
  );
};
export default EditEmailContainer;
