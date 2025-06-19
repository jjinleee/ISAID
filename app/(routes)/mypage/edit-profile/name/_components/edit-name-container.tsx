'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Session } from 'next-auth';
import { router } from 'next/client';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { useHeader } from '@/context/header-context';
import { CircleAlert, SquareCheckBig } from 'lucide-react';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { updateUser } from '@/lib/api/my-page';
import { validateField } from '@/lib/utils';

interface NameData {
  name: string;
  nameEng: string;
}

interface ValidationErrors {
  name: boolean;
}

interface Props {
  session: Session;
}

export const EditNameContainer = ({ session }: Props) => {
  const { setHeader } = useHeader();
  useEffect(() => {
    setHeader('내 정보 수정하기', '이름 수정');
  }, []);

  const [nameData, setNameData] = useState<NameData>({
    name: '곽희건',
    nameEng: 'Jin Lee',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: false,
  });
  const submitData = async () => {
    const data = {
      name: nameData.name,
      eng_name: nameData.nameEng,
    };
    const res = await updateUser(data);
    if (res.success) {
      console.log('성공');
      toast.success('정보 수정이 완료되었습니다!', {
        icon: <SquareCheckBig className='w-5 h-5 text-hana-green' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });
      setTimeout(() => {
        router.back();
      }, 1000);
    } else {
      toast.error('잠시 후 다시 시도해주세요.', {
        duration: 2000,
        icon: <CircleAlert className='w-5 h-5 text-hana-red' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });
    }
  };

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
      <Button
        text={'이름 변경'}
        thin={false}
        active={!validationErrors.name}
        onClick={submitData}
      />
    </div>
  );
};
export default EditNameContainer;
