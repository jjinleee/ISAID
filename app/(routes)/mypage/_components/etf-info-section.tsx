import type { EtfInfo } from '../data/ratio-data';

interface Props {
  selectedEtf: EtfInfo;
}

export const ETFInfoSection = ({ selectedEtf }: Props) => {
  return (
    <div className='w-full'>
      <h1 className='text-xl font-semibold mb-4'>ETF 정보</h1>

      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>종목명</span>
        <span className='font-semibold'>{selectedEtf.name}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>총 매입 금액</span>
        <span className='font-semibold'>{selectedEtf.totalPurchase}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>보유 수량</span>
        <span className='font-semibold'>{selectedEtf.quantity}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>구매 평균 단가</span>
        <span className='font-semibold'>{selectedEtf.avgCost}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>현재가</span>
        <span className='font-semibold'>{selectedEtf.currentPrice}</span>
      </div>
      <div className='flex items-center justify-between p-3 text-sm bg-gray-3 border-b border-b-gray-2'>
        <span>수익률</span>
        <span className='font-semibold'>
          {(selectedEtf.returnRate * 100).toFixed(2) + '%'}
        </span>
      </div>
    </div>
  );
};
export default ETFInfoSection;
