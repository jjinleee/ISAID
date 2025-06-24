interface EtfCardProps {
  issueName: string;
  category: string;
  riskGrade: number;
  score: number;
  metrics: {
    totalFee: number;
    tradingVolume: number;
    netAssetValue: number;
    divergenceRate: number;
    trackingError: number;
  };
  reason: string;
  onClick?: () => void;
}

export default function EtfRecommendCard({
  issueName,
  category,
  riskGrade,
  score,
  metrics,
  onClick,
}: EtfCardProps) {
  return (
    <div
      className='rounded-2xl shadow-md p-4 bg-white w-[240px] space-y-3 cursor-pointer hover:shadow-lg transition'
      onClick={onClick}
    >
      <div className='flex justify-between items-start'>
        <div className='text-base font-semibold text-gray-900 leading-snug'>
          {issueName}
        </div>
        <div className={getRiskColor(riskGrade)}>리스크 {riskGrade}</div>
      </div>
      {/*<Badge className='bg-emerald-100 text-emerald-800 text-xs w-fit'>*/}
      {/*  {category}*/}
      {/*</Badge>*/}

      <div>
        <p className='text-xs text-gray-500 mb-1'>추천 점수</p>
      </div>

      <div className='grid grid-cols-2 gap-3 text-xs text-gray-700'>
        <div>
          <p className='text-gray-400'>추적오차</p>
          <p>{metrics.trackingError}%</p>
        </div>
      </div>
    </div>
  );
}

function getRiskColor(riskGrade: number) {
  const commonStyle = 'rounded-2xl px-4 py-1 text-xs font-medium';
  switch (riskGrade) {
    case 1:
      return `bg-green-100 text-green-800 ${commonStyle}`;
    case 2:
      return `bg-lime-100 text-lime-800 ${commonStyle}`;
    case 3:
      return `bg-yellow-100 text-yellow-800 ${commonStyle}`;
    case 4:
      return `bg-orange-100 text-orange-800 ${commonStyle}`;
    case 5:
      return `bg-red-100 text-red-800 ${commonStyle}`;
    default:
      return `bg-gray-100 text-gray-800 ${commonStyle}`;
  }
}
