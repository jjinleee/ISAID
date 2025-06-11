'use client';
import type { ButtonProps } from '@/types/components.ts';
// ex) <Button
//   text={'thin={true} active={true}'}
//   thin={true}
//   active={true}
//   onClick={() => {
//     console.log('gungun');
//   }}
// />
export const Button = ({ text, thin, active, onClick }: ButtonProps) => {
  const className = `w-full text-center font-semibold rounded-xl cursor-pointer
        ${
          active
            ? 'bg-primary text-white py-4'
            : thin
              ? 'py-3 bg-white border border-primary text-primary'
              : 'py-4 bg-hana-green text-white'
        }`;
  return (
    <div className={className.trim()} {...(onClick ? { onClick } : {})}>
      {text}
    </div>
  );
};
export default Button;
