'use client';

import type { InputProps } from '@/types/components.ts';

// ex) <Input type="number" thin={true} placeholder={'input placeholder'} />
export const CustomInput = ({
  thin,
  type,
  placeholder,
  name,
  field,
  onChange,
  value,
  displayValue,
}: InputProps) => {
  // type : number 일 경우 -> 좌측에 스크롤 버튼이 뜨지 않도록
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ];

      if (
        allowedKeys.includes(e.key) ||
        (e.key >= '0' && e.key <= '9') ||
        e.key === '.' ||
        e.key === '-'
      ) {
        return;
      }

      e.preventDefault();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const input = e.currentTarget;
      const cleanedValue = input.value.replace(/[^0-9.-]/g, '');
      if (input.value !== cleanedValue) {
        input.value = cleanedValue;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };

  // displayValue가 있으면 오버레이 패턴 적용
  if (displayValue != null) {
    return (
      <div className="relative w-full">
        <input
          name={name}
          type={type !== 'number' ? type : 'text'}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onChange={handleChange}
          value={value ?? ''}
          inputMode={type === 'number' ? 'numeric' : undefined}
          className={`
      w-full outline-0 border border-gray-2 rounded-xl focus:border-primary
      ${thin ? 'ps-4 py-3' : 'p-5'}
      text-transparent caret-transparent leading-tight
    `}
        />
        <div
          aria-hidden="true"
          className={`
      absolute inset-0 flex items-center 
      ${thin ? 'px-4' : 'px-5'} 
      pointer-events-none whitespace-pre leading-tight text-black
    `}
        >
          {displayValue}
        </div>
      </div>
    );
  }

  // displayValue 없으면 기존 방식
  return (
    <input
      name={name}
      type={type !== 'number' ? type : 'text'}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onChange={handleChange}
      value={value ?? ''}
      className={`outline-0 border border-gray-2 w-full
        placeholder-gray text-black rounded-xl
        focus:border-primary
        ${thin ? 'ps-4 py-3' : 'p-5'}
      `}
    />
  );
};

export default CustomInput;
