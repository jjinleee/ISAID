interface ProgressBarProps {
  current: number;
  total: number;
  hideStatus?: boolean;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  hideStatus,
                                      className
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div
      className={`w-full relative h-3 rounded-full bg-gray-200 overflow-hidden  ${className}`}
    >
      <div
        className={`h-full bg-primary transition-all duration-300 ease-in-out`}
        style={{ width: `${percentage}%` }}
      />
      {!hideStatus && (
        <div className='absolute right-0 -top-6 text-xs text-gray-500 font-medium'>
          {current}/{total}
        </div>
      )}
    </div>
  );
}
