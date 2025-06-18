'use client';

import { useEffect, useState } from 'react';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { Label } from '@/components/ui/label';
import { validateField } from '@/lib/utils';

interface PasswordData {
  password: string;
  passwordConfirm: string;
  oldPassword: string;
}

interface ValidationErrors {
  password: boolean;
  passwordConfirm: boolean;
  oldPassword: boolean;
}

export const EditPasswordContainer = () => {
  const { setHeader } = useHeader();
  useEffect(() => {
    setHeader('내 정보 수정하기', '비밀번호 수정');
  }, []);

  const [passwordData, setPasswordData] = useState<PasswordData>({
    password: '',
    passwordConfirm: '',
    oldPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    password: true,
    passwordConfirm: true,
    oldPassword: true,
  });

  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'password') {
      const isValid = validateField(field, value, passwordData);
      setShowPasswordError(!isValid && value.length > 0);
    }

    if (
      field === 'password' ||
      field === 'passwordConfirm' ||
      field === 'oldPassword'
    ) {
      setPasswordData((prev) => ({ ...prev, [field]: value }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, value, passwordData),
      }));
    }
  };
  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>비밀번호 변경</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password' className='text-gray-600'>
            비밀번호
          </Label>
          <CustomInput
            type='password'
            thin={true}
            placeholder='비밀번호'
            name='password'
            field='password'
            value={passwordData.password}
            onChangeField={handleInputChange}
          />

          <p
            className={`text-xs text-gray-500 ${
              passwordData.password
                ? showPasswordError
                  ? 'text-red-500'
                  : 'text-primary'
                : 'text-gray-500'
            }`}
          >
            영문+숫자+특수 문자, 8자 이상으로 조합해서 만들어 주세요
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password' className='text-gray-600'>
            비밀번호 확인
          </Label>
          <CustomInput
            type='password'
            thin={true}
            placeholder='비밀번호'
            name='passwordConfirm'
            field='passwordConfirm'
            value={passwordData.passwordConfirm}
            onChangeField={handleInputChange}
          />

          <p
            className={`text-xs text-gray-500 ${
              passwordData.passwordConfirm
                ? passwordData.password != passwordData.passwordConfirm
                  ? 'text-red-500'
                  : 'text-primary'
                : 'text-gray-500'
            }`}
          >
            비밀번호를 한번 더 입력해주세요.
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password' className='text-gray-600'>
            기존 비밀번호
          </Label>
          <CustomInput
            type='password'
            thin={true}
            placeholder='비밀번호'
            name='oldPassword'
            field='oldPassword'
            value={passwordData.oldPassword}
            onChangeField={handleInputChange}
          />
        </div>
      </div>
      <Button
        text={'비밀번호 변경'}
        thin={false}
        active={
          !validationErrors.password &&
          !validationErrors.passwordConfirm &&
          !validationErrors.oldPassword
        }
      />
    </div>
  );
};
export default EditPasswordContainer;
