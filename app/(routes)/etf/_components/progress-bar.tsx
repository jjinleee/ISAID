interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className='w-full relative h-3 rounded-full bg-gray-200 overflow-hidden'>
      <div
        className='h-full bg-primary transition-all duration-300 ease-in-out'
        style={{ width: `${percentage}%` }}
      />
      <div className='absolute right-0 -top-6 text-xs text-gray-500 font-medium'>
        {current}/{total}
      </div>
    </div>
  );
}
