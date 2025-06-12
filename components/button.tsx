import type { ButtonProps } from '@/types/components.ts';

// onClick event 가 있는 컴포넌트입니다. 부모 컴포넌트에서 use client 선언을 해주셔야 오류 없이 사용 가능합니다.
// ex) <Button
//   text={'thin={true} active={true}'}
//   thin={true}
//   active={true}
//   onClick={() => {
//     console.log('gungun');
//   }}
// />
export const Button = ({
  text,
  thin,
  active,
  onClick,
  disabled,
}: ButtonProps) => {
  const className = `w-full text-center font-semibold rounded-md cursor-pointer
        ${
          active
            ? 'bg-primary text-white py-4'
            : thin
              ? 'py-3 bg-white border border-primary text-primary'
              : 'py-4 bg-hana-green text-white'
        }`;
  return (
    <button
      disabled={disabled}
      className={className.trim()}
      {...(onClick && { onClick })}
    >
      {text}
    </button>
  );
};
export default Button;
