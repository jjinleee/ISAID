'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/input';
import { Label } from '@/components/ui/label';
import ArrowLeft from '@/public/images/arrow-left.svg';

export interface FormData {
  name: string;
  phone: string;
  verificationCode: string;
  verificationInput: string;
  address: string;
  email: string;
  password: string;
  addressSearch: string;
}

interface ValidationErrors {
  name: boolean;
  phone: boolean;
  verificationCode: boolean;
  verificationInput: boolean;
  address: boolean;
  email: boolean;
  password: boolean;
}

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    verificationCode: '',
    verificationInput: '',
    address: '',
    email: '',
    password: '',
    addressSearch: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: false,
    phone: false,
    verificationCode: false,
    verificationInput: false,
    address: false,
    email: false,
    password: false,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddressClosing, setIsAddressClosing] = useState(false);

  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [addressSearchValue, setAddressSearchValue] = useState('');

  const steps = [
    { title: '이름을 입력해주세요', field: 'name' },
    { title: '주민등록번호를 입력해주세요', field: 'phone' },
    { title: '인증번호를 입력해주세요', field: 'verificationCode' },
    { title: '주소를 입력해주세요', field: 'address' },
    { title: '본인 인증을 입력해주세요', field: 'email' },
  ];

  const validateField = (field: keyof FormData, value: string): boolean => {
    switch (field) {
      case 'name':
        return value.trim().length > 0;
      case 'phone':
        return /^\d{3}-\d{4}-\d{4}$/.test(value);
      case 'verificationCode':
        return /^\d{6}$/.test(value);
      case 'verificationInput':
        return /^\d{3}$/.test(value);
      case 'address':
        return value.trim().length > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      default:
        return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'password') {
      const isValid = validateField(field, value);
      setShowPasswordError(!isValid && value.length > 0);
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: !validateField(field, value),
    }));
  };

  const isCurrentStepValid = (): boolean => {
    const currentField = steps[currentStep]?.field as keyof FormData;
    if (!currentField) return true;

    if (currentStep === 2) {
      return (
        validateField('verificationCode', formData.verificationCode) &&
        validateField('verificationInput', formData.verificationInput)
      );
    }

    const value = formData[currentField];
    return validateField(currentField, value);
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

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleAddressSearch = () => {
    console.log('Searching for:', addressSearchValue);
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
        {steps.map((id, index) => (
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
            <div className="w-full flex-shrink-0">
              <h1 className="text-xl font-medium mb-8">이름을 입력해주세요</h1>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-600">
                  이름
                </Label>
                <Input
                  type="text"
                  thin={true}
                  placeholder="이름을 입력해주세요"
                  name="name"
                  field="name"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl font-medium mb-2">
                주민등록번호를 입력해주세요
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                휴대 서비스 이용을 위해 필요합니다.
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  thin={true}
                  placeholder="123456-1234567"
                  name="phone"
                  field="phone"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl font-medium mb-2">
                인증번호를 입력해주세요
              </h1>
              <p className="text-gray-500 text-sm mb-8">010-1234-5678</p>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      thin={true}
                      placeholder="010-1234-5678"
                      name="verificationCode"
                      field="verificationCode"
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button
                    onClick={handleSendCode}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    인증번호 전송
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">인증 번호</p>
                  <Input
                    type="number"
                    thin={true}
                    placeholder="인증번호 3자리 입력"
                    name="verificationInput"
                    field="verificationInput"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl font-medium mb-2">주소를 입력해주세요</h1>
              <p className="text-gray-500 text-sm mb-8">
                정확한 위치 정보를 위해 필요합니다.
              </p>
              <div className="space-y-2">
                <div onClick={() => setShowAddressModal(true)}>
                  <Input
                    type="text"
                    thin={true}
                    placeholder="서울시 강남구 대치동 123"
                    name="address"
                    field="address"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0">
              <h1 className="text-xl font-medium mb-2">
                본인 인증을 입력해주세요
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                서비스 이용을 위해 필요합니다.
              </p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600">
                    이메일
                  </Label>
                  <Input
                    type="email"
                    thin={true}
                    placeholder="test@example.com"
                    name="email"
                    field="email"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-600">
                    비밀번호
                  </Label>
                  <Input
                    type="password"
                    thin={true}
                    placeholder="비밀번호"
                    name="password"
                    field="password"
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500">
                    영문+숫자+특수 문자, 8자 이상으로 조합해서 만들어 주세요
                  </p>
                  {showPasswordError && (
                    <div className="space-y-1">
                      <p className="text-xs text-red-500">비밀번호 확인</p>
                      <p className="text-xs text-red-500">비밀번호 확인</p>
                    </div>
                  )}
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
          fixed bottom-0 left-0 right-0 pt-5 pb-10 
          ${isCurrentStepValid() ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {currentStep === steps.length - 1 ? '시작하기' : '다음으로'}
      </Button>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black opacity-50 z-50 flex items-end">
          <div
            className={`w-full bg-white rounded-t-3xl ${isAddressClosing ? 'animate-slide-down' : 'animate-slide-up'}`}
          >
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <div></div>
              <h2 className="text-lg font-medium">집주소 검색</h2>
              <button
                onClick={() => {
                  setIsAddressClosing(true);
                  setTimeout(() => {
                    setShowAddressModal(false);
                    setIsAddressClosing(false);
                  }, 300);
                }}
                className="p-2 -mr-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="relative">
                <Input
                  type="text"
                  thin={true}
                  placeholder="도로명, 건물명 또는 지번 검색"
                  name="addressSearch"
                  field="addressSearch"
                  onChange={(field, value) => {
                    setAddressSearchValue(value);
                  }}
                />
                <button
                  onClick={handleAddressSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="px-4 pb-8 space-y-4">
              <div
                className="cursor-pointer py-3"
                onClick={() => handleAddressSelect('도로명 + 건물 번호')}
              >
                <p className="font-medium">• 도로명 + 건물 번호</p>
                <p className="text-sm text-gray-500">(예 : 송파대로570)</p>
              </div>
              <div
                className="cursor-pointer py-3"
                onClick={() => handleAddressSelect('동/읍/면/리 + 번지')}
              >
                <p className="font-medium">• 동/읍/면/리 + 번지</p>
                <p className="text-sm text-gray-500">(예 : 신천동 7-30)</p>
              </div>
              <div
                className="cursor-pointer py-3"
                onClick={() => handleAddressSelect('건물명, 아파트명')}
              >
                <p className="font-medium">• 건물명, 아파트명</p>
                <p className="text-sm text-gray-500">(예 : 반포자이아파트</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
