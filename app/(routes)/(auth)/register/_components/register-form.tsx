'use client';

import { useState } from 'react';
import ArrowLeft from '@/public/images/arrow-left.svg';
import { CustomInput } from '@/components/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AddressSearch from './address-modal';

export interface FormData {
  name: string;
  rrn: string;
  phone: string;
  verificationCode: string;
  address: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface ValidationErrors {
  name: boolean;
  phone: boolean;
  verificationCode: boolean;
  address: boolean;
  email: boolean;
  password: boolean;
  passwordConfirm: boolean;
}

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    rrn: '',
    phone: '',
    verificationCode: '',
    address: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: false,
    phone: false,
    verificationCode: false,
    address: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

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

      case 'rrn':
        return /^[0-9]{13}$/.test(value);

      case 'phone':
        return /^\d{11,12}$/.test(value);

      case 'verificationCode':
        return /^\d{3}$/.test(value);

      case 'address':
        return value.trim().length > 0;

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
    console.log(
      "validateField('verificationCode', formData.verificationCode) :",
      validateField('verificationCode', formData.verificationCode)
    );
    if (currentField === 'email') {
      return (
        validateField('email', formData.email) &&
        validateField('password', formData.password) &&
        validateField('passwordConfirm', formData.passwordConfirm)
      );
    }

    return validateField(currentField, formData[currentField]);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log('Form submitted:', formData);
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

  return (
    <div className="min-h-screen bg-white pb-24">
      <div
        className="w-full fixed inset-x-0 top-0 py-3 px-6"
        onClick={handleBack}
      >
        <ArrowLeft />
      </div>
      <div className="flex pt-10 gap-2 px-4 mb-8">
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
            <div className="w-full flex-shrink-0 font-light">
              <h1 className="text-xl mb-8">이름을 입력해주세요</h1>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-600">
                  이름
                </Label>
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
            </div>

            <div className="w-full flex-shrink-0 font-light">
              <h1 className="text-xl mb-2">주민등록번호를 입력해주세요</h1>
              <p className="text-sm mb-8">금융 서비스 이용을 위해 필요해요.</p>
              <div className="space-y-2">
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

            <div className="w-full flex-shrink-0 font-light">
              <h1 className="text-xl mb-2">인증번호를 입력해주세요.</h1>
              <p className="text-gray-500 text-sm mb-8">
                본인 확인을 위해 필요해요.
              </p>
              <div className="space-y-4">
                <div className="flex gap-2 ">
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
                  <Button
                    onClick={handleSendCode}
                    className="bg-primary text-white px-4 py-2 rounded-xl !h-[50px]"
                  >
                    인증번호 전송
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">인증 번호</p>
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
            </div>

            <div className="w-full flex-shrink-0 font-light">
              <h1 className="text-xl mb-2">주소를 입력해주세요.</h1>
              <p className="text-gray-500 text-sm mb-8">
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
            </div>

            <div className="w-full flex-shrink-0 font-light">
              <h1 className="text-xl mb-2">본인 인증을 완료해주세요.</h1>
              <p className="text-gray-500 text-sm mb-8">
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
        disabled={!isCurrentStepValid()}
        className={`w-full py-4 font-medium 
          fixed bottom-0 left-0 right-0 pt-5 pb-10  hover:bg-primary 
          ${isCurrentStepValid() ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {currentStep === steps.length - 1 ? '시작하기' : '다음으로'}
      </Button>

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
