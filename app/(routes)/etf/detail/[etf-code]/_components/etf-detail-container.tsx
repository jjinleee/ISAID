'use client';

import { useParams } from 'next/navigation';
import ArrowCross from '@/public/images/arrow-cross';
import Tab from '@/components/tab';
import { formatComma } from '@/lib/utils';
import EtfDetailTable from '../_components/etf-detail-table';
import { etfDetailMap } from '../data/etf-detail-data';

const EtfDetailContainer = () => {
  const params = useParams();
  const etfCode = params['etf-code'] as string;
  const etf = etfDetailMap[etfCode as keyof typeof etfDetailMap];

  if (!etf) return <div>해당 ETF가 존재하지 않습니다.</div>;

  return (
    <>
      <div className='p-6'>
        {/* 헤더 */}
        <div className='border flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-semibold'>{etf.categoryId}</p>
            <div className=''>
              <span className='text-xl font-bold mr-2'>{etf.name}</span>
              <span className='text-sm text-gray-500 mb-4'>{etf.code}</span>
            </div>
          </div>
          <div className='flex items-end '>
            <span className='text-xl font-bold mr-2 leading-none'>
              {etf.price}
            </span>
            <ArrowCross direction={`${etf.rate > 0 ? 'up' : 'down'}`} />
            <span
              className={`text-xs leading-none ${etf.rate > 0 ? 'text-hana-red' : 'text-blue'}`}
            >
              {etf.rate > 0 ? `+${etf.rate} %` : `-${etf.rate} %`}
            </span>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <div className='flex items-center gap-1'>
              <div className=''>
                <p>iNAV</p>
                <p>{formatComma(etf.iNav)}</p>
              </div>
              <p
                className={`${etf.iNavRate > 0 ? 'text-hana-red' : 'text-blue'}`}
              >
                ({etf.iNavRate > 0 ? `+${etf.iNavRate}%` : `-${etf.iNavRate}%`})
              </p>
            </div>
            <div className='text-end'>
              <p>거래량</p>
              <p>{formatComma(etf.volume)}주</p>
            </div>
          </div>
        </div>
        <div className='border '>gml</div>

        <EtfDetailTable etf={etf} />
      </div>
    </>
  );
};

export default EtfDetailContainer;
