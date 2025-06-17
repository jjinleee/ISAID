import type { ButtonProps } from '@/types/components.ts';

// onClick event 가 있는 컴포넌트입니다. 부모 컴포넌트에서 use client 선언을 해주셔야 오류 없이 사용 가능합니다.
// ex) <Button
//   text={'thin={true} active={true}'}
//   thin={true}
//   active={true}
//   disabled={false}
//   onClick={() => {
//     console.log('gungun');
//   }}
//   className='!bg-gray'
// />
export const Button = ({
  text,
  thin,
  active,
  onClick,
  disabled,
  className = '',
}: ButtonProps) => {
  const computedClassName = `
  w-full text-center font-semibold rounded-md cursor-pointer
  ${
    disabled
      ? 'bg-subtitle text-white py-4 cursor-not-allowed'
      : active
        ? 'bg-primary text-white py-4'
        : thin
          ? 'py-3 bg-white border border-primary text-primary'
          : 'py-4 bg-subtitle text-white'
  }
  ${className}
`.trim();

  return (
    <button
      disabled={disabled}
      className={computedClassName}
      {...(onClick && { onClick })}
    >
      {text}
    </button>
  );
};
export default Button;
