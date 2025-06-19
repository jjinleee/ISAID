'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { useHeader } from '@/context/header-context';
import { CircleAlert, SquareCheckBig } from 'lucide-react';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { fetchMyInfo, updateUser } from '@/lib/api/my-page';
import { validateField } from '@/lib/utils';
import { submitUserUpdate } from '../../utils';

interface NameData {
  name: string;
  nameEng?: string;
}

interface ValidationErrors {
  name: boolean;
}

export const EditNameContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nameData, setNameData] = useState<NameData>({
    name: '',
    nameEng: '',
  });

  useEffect(() => {
    setHeader('내 정보 수정하기', '이름 수정');
    const fetchMe = async () => {
      const res = await fetchMyInfo();
      setNameData({
        name: res.name || '',
        nameEng: res.eng_name || '',
      });
    };
    fetchMe();
  }, []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: false,
  });
  const submitData = async () => {
    const data = {
      name: nameData.name,
      engName: nameData.nameEng,
    };
    setLoading(true);
    await submitUserUpdate({
      data: data,
      onSuccess: () => router.back(),
      onFinally: () => setLoading(false),
    });
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
        disabled={loading}
      />
    </div>
  );
};
export default EditNameContainer;
