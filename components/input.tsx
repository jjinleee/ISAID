import type { InputProps } from '../types/components.ts';

// ex) <Input type="number" thin={true} placeholder={'input placeholder'} />
export const Input = ({ thin, type, placeholder }: InputProps) => {
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
      const value = input.value;

      const cleanedValue = value.replace(/[^0-9.-]/g, '');

      if (value !== cleanedValue) {
        input.value = cleanedValue;
      }
    }
  };

  return (
    <input
      type={type !== 'number' ? type : 'text'}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      className={`outline-0 border border-gray-2 w-full
      placeholder-gray  text-black rounded-xl
      focus:border-primary
      ${thin ? 'ps-4 py-3' : 'p-5'}
      `}
    />
  );
};
export default Input;
