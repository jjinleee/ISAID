'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { fetchMyInfo } from '@/lib/api/my-page';
import { validateField } from '@/lib/utils';
import { submitUserUpdate } from '../../utils';

interface PhoneData {
  phone: string;
  verificationCode?: string;
}

interface ValidationErrors {
  phone: boolean;
  verificationCode?: boolean;
}

export const EditPhoneContainer = () => {
  const { setHeader } = useHeader();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false); // 인증번호 전송 중 여부
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [sentCode, setSentCode] = useState(''); // 전송된 코드

  useEffect(() => {
    setHeader('내 정보 수정하기', '전화번호 수정');
  }, []);

  const [phoneData, setPhoneData] = useState<PhoneData>({
    phone: '',
    verificationCode: '',
  });

  useEffect(() => {
    setHeader('내 정보 수정하기', '전화번호 수정');
    const fetchMe = async () => {
      const res = await fetchMyInfo();
      setPhoneData({
        phone: res.phone || '',
      });
    };
    fetchMe();
  }, []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    phone: false,
    verificationCode: true,
  });

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      const raw = value.replace(/\D/g, '').slice(0, 11);
      setPhoneData((prev) => ({ ...prev, [field]: raw }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, raw, phoneData),
      }));
      return;
    }
    if (field === 'verificationCode') {
      const raw = value.replace(/\D/g, '').slice(0, 3);
      setPhoneData((prev) => ({ ...prev, verificationCode: raw }));

      if (raw.length === 3 && raw === sentCode) {
        setValidationErrors((prev) => ({ ...prev, verificationCode: false }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          verificationCode: !validateField('verificationCode', raw, phoneData),
        }));
      }
      return;
    }
  };

  // 인증번호 전송
  const handleSendCode = async () => {
    if (validationErrors.phone || !phoneData.phone) {
      toast.error('올바른 전화번호를 입력해주세요.');
      return;
    }

    setSending(true);
    try {
      // 임시 3자리 코드 생성
      const code = Math.floor(100 + Math.random() * 900).toString();

      const res = await fetch('/api/auth/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneData.phone, code }),
      });
      const data = await res.json();

      if (data.success) {
        setIsCodeSent(true);
        setSentCode(code);
        toast.success('인증번호가 전송되었습니다.');
      } else {
        toast.error('인증번호 전송에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      toast.error('인증번호 전송 중 오류가 발생했습니다.');
    } finally {
      setSending(false);
    }
  };

  const submitData = async () => {
    const data = { phone: phoneData.phone };
    setLoading(true);
    await submitUserUpdate({
      data: data,
      onSuccess: () => router.back(),
      onFinally: () => setLoading(false),
    });
  };

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>전화번호 변경</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label>전화번호</label>
          <div className='flex gap-2'>
            <CustomInput
              thin={true}
              type={'number'}
              field={'phone'}
              placeholder={''}
              displayValue={formatPhoneNumber(phoneData.phone)}
              value={phoneData.phone}
              onChangeField={handleInputChange}
            />
            <button
              className='bg-primary text-white px-4 py-2 rounded-xl whitespace-nowrap disabled:opacity-50'
              onClick={handleSendCode}
              disabled={validationErrors.phone || sending}
            >
              {isCodeSent ? '재전송' : '인증번호 전송'}
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label>인증번호</label>
          <CustomInput
            type='number'
            thin={true}
            placeholder='인증번호 3자리 입력'
            name='verificationCode'
            field='verificationCode'
            value={phoneData.verificationCode}
            onChangeField={handleInputChange}
          />
        </div>
      </div>
      <Button
        text={'전화번호 변경'}
        thin={false}
        active={!validationErrors.phone && !validationErrors.verificationCode}
        onClick={submitData}
        disabled={validationErrors.phone || validationErrors.verificationCode}
      />
    </div>
  );
};
export default EditPhoneContainer;
