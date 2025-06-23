'use client';

import { useState } from 'react';
import { CircleAlert, SquareCheckBig, X } from 'lucide-react';
import Button from '@/components/button';

export default function RecommendModal({
  onClose,
  btnClick,
}: {
  onClose: () => void;
  btnClick: () => void;
}) {
  const reasons = [
    {
      title: '낮은 총보수',
      desc: '총보수가 0.3% 미만으로 낮아, 장기 투자 시 비용 부담을 줄이고 실질 수익률을 높일 수 있습니다. 수수료에 민감한 투자자에게 유리한 선택입니다.',
    },
    {
      title: '높은 유동성',
      desc: '일일 평균 거래대금이 10억원 이상으로, 매수·매도가 원활합니다. 단기 매매 전략에 적합합니다.',
    },
    {
      title: '운용 안정성',
      desc: '순자산총액이 1,000억 원 이상으로, 대형 ETF로서 투자자 신뢰도와 안정적인 운용이 가능합니다.',
    },
    {
      title: '낮은 괴리율',
      desc: '괴리율이 ±0.5% 이내로 낮아, 시장가격과 NAV가 거의 일치합니다. 합리적인 매수·매도가 가능합니다.',
    },
    {
      title: '초저위험 등급',
      desc: '리스크 등급 5로 가격 변동성이 낮고 안정적인 운용이 기대됩니다.',
    },
  ];
  return (
    <div
      className='fixed inset-0 z-52 flex items-center justify-center'
      onClick={onClose}
    >
      <div className='absolute inset-0 bg-black opacity-50' />
      <div
        className='relative bg-white rounded-2xl p-6 w-[90%] max-w-md z-10'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
        >
          <X className='w-5 h-5' />
        </button>

        <>
          <div className='flex flex-col gap-2 p-5'>
            <h1 className='font-semibold text-xl'>이래서 추천드려요!</h1>
            {reasons.map(({ title, desc }, idx) => (
              <div
                key={idx}
                className='flex items-start gap-3 p-4 rounded-lg bg-[#f9fbfc] border border-gray-200'
              >
                <CircleAlert className='w-6 h-6 text-green-600 mt-[2px] flex-shrink-0' />
                <div>
                  <p className='font-semibold text-sm text-gray-900'>{title}</p>
                  <p className='text-sm text-gray-700 mt-1'>{desc}</p>
                </div>
              </div>
            ))}
            <Button
              thin={false}
              text={'ETF 상세 정보 보기'}
              onClick={btnClick}
              active={true}
            />
          </div>
        </>
      </div>
    </div>
  );
}
