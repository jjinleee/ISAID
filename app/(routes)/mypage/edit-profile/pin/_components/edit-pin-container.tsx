'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import SecurePinModal from '@/components/secure-pin-modal';
import { Label } from '@/components/ui/label';
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
  const [showOldModal, setShowOldModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    setHeader('내 정보 수정하기', '전화번호 수정');
  }, []);

  const [pinData, setPinData] = useState<PinData>({
    oldPin: '',
    newPin: '',
  });

  useEffect(() => {
    setHeader('내 정보 수정하기', '전화번호 수정');
  }, []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    oldPin: true,
    newPin: true,
  });
  useEffect(() => {
    setValidationErrors({
      oldPin: pinData.oldPin.length !== 6,
      newPin: pinData.newPin.length !== 6,
    });
  }, [pinData]);

  const handleInputChange = (field: keyof PinData, value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 6);

    setPinData((prev) => ({ ...prev, [field]: raw }));

    setValidationErrors((prev) => ({
      ...prev,
      [field]: raw.length === 6,
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
          <Label htmlFor='password' className='text-md'>
            이전 비밀번호
          </Label>
          <div onClick={() => setShowOldModal(true)}>
            <CustomInput
              type='password'
              thin={true}
              placeholder=''
              value={'●'.repeat(pinData.oldPin.length)}
              onChange={(val) => handleInputChange('oldPin', val)}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='password' className='text-md'>
            새로운 비밀번호
          </Label>
          <div onClick={() => setShowNewModal(true)}>
            <CustomInput
              type='password'
              thin={true}
              placeholder=''
              value={'●'.repeat(pinData.newPin.length)}
              onChange={(val) => handleInputChange('newPin', val)}
            />
          </div>
        </div>
      </div>
      <Button
        text={'비밀번호 변경'}
        thin={false}
        active={!validationErrors.oldPin && !validationErrors.newPin}
        onClick={submitData}
        disabled={validationErrors.oldPin || validationErrors.newPin || loading}
      />
      {showOldModal && (
        <SecurePinModal
          visible={showOldModal}
          onClose={() => setShowOldModal(false)}
          onSubmit={async (pin) => {
            setPinData((prev) => ({ ...prev, oldPin: pin }));
            setShowOldModal(false);
            return true;
          }}
        />
      )}
      {showNewModal && (
        <SecurePinModal
          visible={showNewModal}
          onClose={() => setShowNewModal(false)}
          onSubmit={async (pin) => {
            setPinData((prev) => ({ ...prev, newPin: pin }));
            setShowNewModal(false);
            return true;
          }}
        />
      )}
    </div>
  );
};
export default EditPinContainer;
