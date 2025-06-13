'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@/public/images/arrow-left.svg';
import { CustomInput } from '@/components/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AddressSearch from './address-modal';

export interface FormData {
  name: string;
  nameEng: string;
  rrn: string;
  phone: string;
  verificationCode: string;
  address: string;
  telNo: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface ValidationErrors {
  name: boolean;
  nameEng: boolean;
  phone: boolean;
  verificationCode: boolean;
  address: boolean;
  telNo: boolean;
  email: boolean;
  password: boolean;
  passwordConfirm: boolean;
}

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    nameEng: '',
    rrn: '',
    phone: '',
    verificationCode: '',
    address: '',
    telNo: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: false,
    nameEng: false,
    phone: false,
    verificationCode: false,
    address: false,
    telNo: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  const steps: (keyof FormData)[] = [
    'name',
    'rrn',
    'phone',
    'address',
    'email',
  ];

  const validateField = (field: keyof FormData, value: string): boolean => {
    switch (field) {
      case 'name':
        return value.trim().length > 0;

      case 'nameEng':
        return (
          value === '' || (/^[A-Z ]+$/.test(value) && value.trim().length > 0)
        );

      case 'rrn':
        return /^[0-9]{13}$/.test(value);

      case 'phone':
        return /^\d{11,12}$/.test(value);

      case 'verificationCode':
        return /^\d{3}$/.test(value);

      case 'address':
        return value.trim().length > 0;

      case 'telNo':
        return value === '' || /^\d{2,10}$/.test(value);

      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      case 'password':
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);

      case 'passwordConfirm':
        return value === formData.password && value.length > 0;

      default:
        return true;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      const raw = value.replace(/\D/g, ''); // 숫자만 추출
      setFormData((prev) => ({ ...prev, [field]: raw }));

      setValidationErrors((prev) => ({
        ...prev,
        [field]: !validateField(field, raw),
      }));
      return;
    }

    if (field === 'rrn') {
      const raw = value.replace(/\D/g, '').slice(0, 13);
      setFormData((prev) => ({ ...prev, rrn: raw }));
      return;
    }

    if (field === 'password') {
      const isValid = validateField(field, value);
      setShowPasswordError(!isValid && value.length > 0);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    setValidationErrors((prev) => ({
      ...prev,
      [field]: !validateField(field, value),
    }));
  };

  const isCurrentStepValid = (): boolean => {
    const currentField = steps[currentStep];
    if (!currentField) return true;

    if (currentField === 'phone') {
      return (
        validateField('phone', formData.phone) &&
        validateField('verificationCode', formData.verificationCode)
      );
    }

    if (currentField === 'email') {
      return (
        validateField('email', formData.email) &&
        validateField('password', formData.password) &&
        validateField('passwordConfirm', formData.passwordConfirm)
      );
    }

    return validateField(currentField, formData[currentField]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/auth/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          eng_name: formData.nameEng,
          email: formData.email,
          password: formData.password,
          rrn: formData.rrn,
          phone: formData.phone,
          address: formData.address,
          telno: formData.telNo,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || '알 수 없는 서버 오류');
      }

      router.push('/');
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSendCode = () => {
    setIsCodeSent(true);
  };

  const handleAddressSelect = (address: string) => {
    handleInputChange('address', address);
    setShowAddressModal(false);
  };

  const formatRRN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 13);

    if (digits.length <= 6) {
      return digits;
    }

    if (digits.length === 7) {
      return `${digits.slice(0, 6)}-${digits[6]}`;
    }

    const head = digits.slice(0, 6);
    const first = digits[6];
    const extra = digits.length - 7;
    return `${head}-${first}${'•'.repeat(extra)}`;
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatTelNo = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (!digits) return '';

    const areaLen = digits.startsWith('02') ? 2 : 3;
    const area = digits.slice(0, areaLen);
    const rest = digits.slice(areaLen);

    const len = rest.length;
    if (len <= 4) {
      return area + rest;
    }

    if (len <= 6) {
      return `${area}-${rest.slice(0, 4)}-${rest.slice(4)}`;
    }

    const prefix = rest.slice(0, len - 4);
    const suffix = rest.slice(len - 4);
    return `${area}-${prefix}-${suffix}`;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div
        className="w-full fixed inset-x-0 top-0 py-3 px-6"
        onClick={handleBack}
      >
        <ArrowLeft />
      </div>
      <div className="flex pt-10 gap-2 px-4 mb-12">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium  ${
              index < currentStep
                ? 'bg-primary text-white'
                : index === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-white border border-primary text-primary'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="px-4 flex-1">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            <div className="w-full flex-shrink-0 flex flex-col gap-3">
              <h1 className="text-xl mb-8 font-light">이름을 입력해주세요</h1>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 text-sm">
                  이름을 입력해주세요.
                </span>
                <CustomInput
                  type="text"
                  thin={true}
                  placeholder="이름을 입력해주세요"
                  name="name"
                  field="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm ">
                  영문 이름을 입력해주세요. (선택)
                </p>
                <CustomInput
                  type="text"
                  thin={true}
                  placeholder="이름을 입력해주세요"
                  name="nameEng"
                  field="nameEng"
                  value={formData.nameEng}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl font-light mb-8">
                주민등록번호를 입력해주세요
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                금융 서비스 이용을 위해 필요해요.
              </p>
              <div className="">
                <CustomInput
                  type="text"
                  thin={true}
                  placeholder="123456-1234567"
                  name="rrn"
                  field="rrn"
                  value={formData.rrn}
                  displayValue={formatRRN(formData.rrn)}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl mb-8 font-light">
                인증번호를 입력해주세요.
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                본인 확인을 위해 필요해요.
              </p>
              <div className="mb-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <CustomInput
                      type="number"
                      thin={true}
                      placeholder="010-1234-5678"
                      name="phone"
                      field="phone"
                      value={formData.phone}
                      displayValue={formatPhoneNumber(formData.phone)}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    onClick={handleSendCode}
                    className="bg-primary text-white px-4 py-2 rounded-xl "
                  >
                    인증번호 전송
                  </button>
                </div>
              </div>
              <div className="">
                <p className="text-gray-500 text-sm mb-2">인증 번호</p>
                <CustomInput
                  type="number"
                  thin={true}
                  placeholder="인증번호 3자리 입력"
                  name="verificationCode"
                  field="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl  mb-8 font-light">주소를 입력해주세요.</h1>
              <p className="text-gray-500 text-sm mb-2">
                본인 확인을 위해 필요해요.
              </p>
              <div className="space-y-2">
                <div onClick={() => setShowAddressModal(true)}>
                  <CustomInput
                    type="text"
                    thin={true}
                    placeholder="서울시 강남구 대치동 123"
                    name="address"
                    field="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-gray-500 text-sm">
                  자택 번호를 입력해주세요. (선택)
                </span>
                <CustomInput
                  type="number"
                  thin={true}
                  placeholder="02-913-9112"
                  name="telNo"
                  field="telNo"
                  value={formData.telNo}
                  displayValue={formatTelNo(formData.telNo)}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl mb-2 font-light">
                본인 인증을 완료해주세요.
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                마지막 단계에요! 거의 다 왔어요.
              </p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600">
                    이메일
                  </Label>
                  <CustomInput
                    type="email"
                    thin={true}
                    placeholder="test@example.com"
                    name="email"
                    field="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-600">
                    비밀번호
                  </Label>
                  <CustomInput
                    type="password"
                    thin={true}
                    placeholder="비밀번호"
                    name="password"
                    field="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />

                  <p
                    className={`text-xs text-gray-500 ${
                      formData.password
                        ? showPasswordError
                          ? 'text-red-500'
                          : 'text-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    영문+숫자+특수 문자, 8자 이상으로 조합해서 만들어 주세요
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-600">
                    비밀번호 확인
                  </Label>
                  <CustomInput
                    type="password"
                    thin={true}
                    placeholder="비밀번호"
                    name="passwordConfirm"
                    field="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                  />

                  <p
                    className={`text-xs text-gray-500 ${
                      formData.passwordConfirm
                        ? formData.password != formData.passwordConfirm
                          ? 'text-red-500'
                          : 'text-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    비밀번호를 한번 더 입력해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!isCurrentStepValid() || isSubmitting}
        className={`w-full py-4 font-medium 
          fixed bottom-0 left-0 right-0 pt-5 pb-10  hover:bg-primary 
          ${isCurrentStepValid() ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {currentStep === steps.length - 1 ? '시작하기' : '다음으로'}
      </Button>
      {submitError && (
        <p className="mt-2 text-center text-sm text-red-500">{submitError}</p>
      )}

      {showAddressModal && (
        <AddressSearch
          onComplete={(addr) => handleAddressSelect(addr)}
          onClose={() => setShowAddressModal(false)}
          openState={showAddressModal}
        />
      )}
    </div>
  );
}
