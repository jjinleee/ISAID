import type { EtfDetail } from '@/types/etf';
import { formatComma, formatDate } from '@/lib/utils';

interface EtfDetailTableProps {
  etf: EtfDetail;
}

export default function EtfDetailTable({ etf }: EtfDetailTableProps) {
  return (
    <div className='w-full'>
      <h1 className='text-xl font-semibold mb-4'>ETF 개요</h1>

      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>운용사</span>
        <span className='font-semibold'>{etf.comAbbrv}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>상장일</span>
        <span className='font-semibold'>{formatDate(etf.listDate)}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>기초지수</span>
        <span className='font-semibold'>{etf.etfObjIndexName}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>기초자산분류</span>
        <span className='font-semibold'>{etf.idxMarketType}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>총보수</span>
        <span className='font-semibold'>{etf.etfTotalFee}%</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>과세유형</span>
        <span className='font-semibold'>{etf.taxType}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>순자산총액</span>
        <span className='font-semibold'>{formatComma(etf.marketCap)}</span>
      </div>
    </div>
  );
}
