import type { EtfDetail } from '../data/etf-detail-data';

interface EtfDetailTableProps {
  etf: EtfDetail;
}

export default function EtfDetailTable({ etf }: EtfDetailTableProps) {
  return (
    <>
      <h1 className='text-xl font-semibold'>ETF 개요</h1>

      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>운용사</span>
        <span className='font-semibold'>{etf.company}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>상장일</span>
        <span className='font-semibold'>{etf.listedDate}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>기초지수</span>
        <span className='font-semibold'>{etf.index}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>시가총액</span>
        <span className='font-semibold'>{etf.marketCap}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>순자산(AUIM)</span>
        <span className='font-semibold'>{etf.netAsset}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>상장주식수</span>
        <span className='font-semibold'>{etf.totalShares}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>구성종목수</span>
        <span className='font-semibold'>{etf.holdingsCount}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>전일NAV</span>
        <span className='font-semibold'>{etf.nav}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>펀드형태</span>
        <span className='font-semibold'>{etf.fundType}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>과세유형</span>
        <span className='font-semibold'>{etf.taxType}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-[#F3F4F6] border-b border-b-gray-2'>
        <span>복제방법</span>
        <span className='font-semibold'>{etf.replicationMethod}</span>
      </div>
    </>
  );
}
