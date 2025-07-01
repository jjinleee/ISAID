interface SkeletonProps {
  width?: string;
  height?: number;
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}
      style={{ width, height }}
    >
      <div className='absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200' />
    </div>
  );
}
