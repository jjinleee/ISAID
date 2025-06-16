import { useRouter } from 'next/navigation';
import Spinner from '@/public/images//spinner.svg';

interface EtfItem {
  name: string;
  code: string;
  volume: string;
  price: string;
  changeRate: string;
}

interface EtfTableProps {
  data: EtfItem[];
}

export default function EtfTable({ data }: EtfTableProps) {
  const router = useRouter();
  return (
    <div className='w-full'>
      <div className='grid grid-cols-3 bg-primary text-white text-sm font-semibold px-4 py-2'>
        <div>종목</div>
        <div className='text-right'>거래량</div>
        <div className='text-right'>현재가</div>
      </div>
      {data.map((item, index) => (
        <div
          key={index}
          className='grid grid-cols-3 items-center px-4 py-3 border-b border-hana-green cursor-pointer'
          onClick={() => router.push(`/etf/detail/${item.code}`)}
        >
          <div>
            <div className='font-medium text-sm'>{item.name}</div>
            <div className='text-xs text-subtitle'>{item.code}</div>
          </div>

          <div className='text-right text-sm font-medium'>{item.volume}</div>

          <div className='text-right'>
            <div className='text-sm font-medium'>{item.price}</div>
            <div
              className={`text-xs ${parseFloat(item.changeRate.trim()) > 0 ? 'text-hana-red' : 'text-blue'}`}
            >
              {item.changeRate}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
