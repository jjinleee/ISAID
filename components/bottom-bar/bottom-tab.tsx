import type { BottomTabProps } from '@/types/components.ts';

export const BottomTab = ({ Icon, text, active, onClick }: BottomTabProps) => {
  return (
    <div
      className={`flex flex-col gap-1 pt-3 pb-3 items-center font-semibold ${active ? 'text-primary' : 'text-gray'}`}
      onClick={onClick}
    >
      <Icon width={24} height={24} />
      {text}
    </div>
  );
};
export default BottomTab;
