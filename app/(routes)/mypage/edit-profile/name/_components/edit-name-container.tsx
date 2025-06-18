'use client';

import { useState } from 'react';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { validateField } from '@/lib/utils';

interface NameData {
  name: string;
  nameEng: string;
}

interface ValidationErrors {
  name: boolean;
}

export const EditNameContainer = () => {
  const [nameData, setNameData] = useState<NameData>({
    name: '곽희건',
    nameEng: 'Jin Lee',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: false,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'name' || field === 'nameEng') {
      setNameData((prev) => ({ ...prev, [field]: value }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, value, nameData),
      }));
    }
  };

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>이름 변경</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label>이름</label>
          <CustomInput
            thin={true}
            type={'text'}
            field='name'
            placeholder={''}
            value={nameData.name}
            onChangeField={handleInputChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label>영문 이름</label>
          <CustomInput
            thin={true}
            type={'text'}
            field='nameEng'
            placeholder={''}
            value={nameData.nameEng}
            onChangeField={handleInputChange}
          />
        </div>
      </div>
      <Button text={'이름 변경'} thin={false} active={!validationErrors.name} />
    </div>
  );
};
export default EditNameContainer;
