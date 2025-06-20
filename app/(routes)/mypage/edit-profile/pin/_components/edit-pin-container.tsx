'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import Input from '@/components/input';
import { validateField } from '@/lib/utils';
import { submitUserUpdate } from '../../utils';

interface PinData {
  oldPin: string;
  newPin: string;
}

interface ValidationErrors {
  oldPin: boolean;
  newPin?: boolean;
}

export const EditPinContainer = () => {
  const { setHeader } = useHeader();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeader('내 정보 수정하기', '전화번호 수정');
  }, []);

  const [pinData, setPinData] = useState<PinData>({
    oldPin: '',
    newPin: '',
  });
  useEffect(() => {
    console.log('pinData : ', pinData);
  }, [pinData]);

  useEffect(() => {
    setHeader('내 정보 수정하기', '전화번호 수정');
  }, []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    oldPin: true,
    newPin: true,
  });

  const handleInputChange = (field: keyof PinData, value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 6);

    setPinData((prev) => ({ ...prev, [field]: raw }));

    setValidationErrors((prev) => ({
      ...prev,
      [field]: !(raw.length === 6 && validateField(field, raw, pinData)),
    }));
  };

  const submitData = async () => {
    const data = { oldPinCode: pinData.oldPin, pinCode: pinData.newPin };
    setLoading(true);
    await submitUserUpdate({
      data: data,
      onSuccess: () => router.back(),
      onFinally: () => setLoading(false),
    });
  };

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>간편 비밀번호 변경</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label>이전 비밀번호</label>
          <CustomInput
            type='password'
            thin={true}
            placeholder=''
            value={pinData.oldPin}
            onChange={(val) => handleInputChange('oldPin', val)}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label>새로운 비밀번호</label>
          <CustomInput
            type='password'
            thin={true}
            placeholder=''
            value={pinData.newPin}
            onChange={(val) => handleInputChange('newPin', val)}
          />
        </div>
      </div>
      <Button
        text={'비밀번호 변경'}
        thin={false}
        active={!validationErrors.oldPin && !validationErrors.newPin}
        onClick={submitData}
        disabled={validationErrors.oldPin || validationErrors.newPin}
      />
    </div>
  );
};
export default EditPinContainer;
