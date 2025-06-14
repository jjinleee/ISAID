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
  return (
    <div className='w-full'>
      <div className='grid grid-cols-3 bg-teal-500 text-white text-sm font-semibold px-4 py-2'>
        <div>종목</div>
        <div className='text-right'>거래량</div>
        <div className='text-right'>현재가</div>
      </div>

      {data.map((item, index) => (
        <div
          key={index}
          className='grid grid-cols-3 items-center px-4 py-3 border-b border-gray-200'
        >
          <div>
            <div className='font-medium text-sm'>{item.name}</div>
            <div className='text-xs text-gray-400'>{item.code}</div>
          </div>

          <div className='text-right text-sm font-medium'>{item.volume}</div>

          <div className='text-right'>
            <div className='text-sm font-medium'>{item.price}</div>
            <div className='text-xs text-hana-red'>{item.changeRate}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
