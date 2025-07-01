'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';
import { submitUserUpdate } from '@/app/(routes)/mypage/edit-profile/utils';
import { useHeader } from '@/context/header-context';
import ModalWrapper from '@/utils/modal';
import AddressSearch from '@/components/address-modal';
import Button from '@/components/button';
import CustomInput from '@/components/input';
import { fetchMyInfo } from '@/lib/api/my-page';
import { formatTelNo, validateField } from '@/lib/utils';

interface HomeData {
  address: string;
  telNo?: string;
}

interface ValidationErrors {
  address: boolean;
}

export const EditHomeContainer = () => {
  const { setHeader } = useHeader();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeader('내 정보 수정하기', '자택 정보 수정');
  }, []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [homeData, setHomeData] = useState<HomeData>({
    address: '',
    telNo: '',
  });

  useEffect(() => {
    setHeader('내 정보 수정하기', '자택 정보 수정');
    const fetchMe = async () => {
      const res = await fetchMyInfo();

      setHomeData({
        address: res.address || '',
        telNo: res.telno || '',
      });
    };
    fetchMe();
  }, []);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    address: false,
  });
  const handleAddressSelect = (address: string) => {
    handleInputChange('address', address);
    setShowAddressModal(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'address' || field === 'telNo') {
      setHomeData((prev) => ({ ...prev, [field]: value }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, value, homeData),
      }));
    }
  };

  const submitData = async () => {
    const data = {
      address: homeData.address,
      telno: homeData.telNo || '',
    };
    setLoading(true);
    await submitUserUpdate({
      data: data,
      onSuccess: () => router.push('/mypage/edit-profile'),
      onFinally: () => setLoading(false),
    });
  };

  return (
    <div className='w-full pt-8 pb-10 px-7 flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>자택 정보 변경</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label>주소</label>
          <div onClick={() => setShowAddressModal(true)}>
            <CustomInput
              type='text'
              thin={true}
              placeholder='서울시 강남구 대치동 123'
              name='address'
              field='address'
              value={homeData.address}
              onChangeField={handleInputChange}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label>전화 번호</label>
          <CustomInput
            thin={true}
            type={'number'}
            field='telNo'
            placeholder={''}
            value={homeData.telNo}
            displayValue={homeData.telNo ? formatTelNo(homeData.telNo) : ''}
            onChangeField={handleInputChange}
          />
        </div>
      </div>
      <Button
        text={'자택 정보 변경'}
        thin={false}
        active={!validationErrors.address}
        disabled={loading}
        onClick={submitData || validationErrors.address}
      />
      {showAddressModal && (
        <ModalWrapper headerOnly={true}>
          <AddressSearch
            onCompleteAction={(addr) => handleAddressSelect(addr)}
            onCloseAction={() => setShowAddressModal(false)}
            openState={showAddressModal}
          />
        </ModalWrapper>
      )}
    </div>
  );
};
export default EditHomeContainer;
