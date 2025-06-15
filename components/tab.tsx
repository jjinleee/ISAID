import type { TabProps } from '@/types/components.ts';

// ex) <Tab text="기본정보" active={false} rounded={false} />

export const Tab = ({ text, rounded, active, onClick }: TabProps) => {
  return (
    <div
      className={`
      w-full
      text-center
        font-semibold leading-none
        ${rounded ? 'px-4 rounded-3xl text-subtitle bg-gray-3' : 'px-3 text-black bg-white'} 
        py-2 inline-block
        transition-all duration-300 ease-in-out
        ${active ? (rounded ? 'text-white bg-primary' : 'border-b border-b-primary') : 'border-b border-b-gray-2'}
      `}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Tab;
