'use client';

import { Coffee, DollarSign, PlaySquare, Trophy, Wallet } from 'lucide-react';

const format = (n: number) => n.toLocaleString('ko-KR');

const Calculate = ({
  taxData,
  userName,
}: {
  taxData: any;
  userName: string;
}) => {
  const savedTax = Math.floor(taxData.savedTax);

  const COFFEE_PRICE = 4_500;
  const NETFLIX_PRICE = 5_500;
  const coffees = Math.floor(savedTax / COFFEE_PRICE);
  const netflixs = Math.floor(savedTax / NETFLIX_PRICE);

  return (
    <div className='rounded-xl bg-white px-5 sm:px-10 py-6 shadow-sm mt-4'>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-3 items-center'>
          <Trophy className='w-5 h-5 text-hana-green' />
          <p className='font-semibold text-lg'>{userName}님의 절세 리포트</p>
        </div>
        <p className='text-xs text-gray-4 pl-8'>
          나는 지금까지 얼마나 현명한 투자를 하고 있었을까? 절세 리포트를 통해
          확인해 보세요!
        </p>
      </div>

      <div className='mt-6 flex gap-2'>
        <DollarSign className='w-6 h-6 text-hana-green' />
        <div>
          <p className='text-sm text-gray-500'>지금까지 아낀 세금</p>
          <p className='text-2xl font-extrabold text-hana-green'>
            {Math.floor(taxData.generalAccountTax).toLocaleString()} 원
          </p>
        </div>
      </div>

      <div className='mt-5 grid grid-cols-2 gap-4 text-center'>
        <div className='flex flex-col items-center'>
          <Coffee className='w-6 h-6 text-brown-500 mb-1' />
          <p className='text-sm text-gray-500'>아메리카노</p>
          <p className='font-semibold text-gray-700'>{coffees}잔</p>
        </div>
        <div className='flex flex-col items-center'>
          <PlaySquare className='w-6 h-6 text-red-500 mb-1' />
          <p className='text-sm text-gray-500'>넷플릭스 1인 요금</p>
          <p className='font-semibold text-gray-700'>{netflixs}개월</p>
        </div>
      </div>

      <div className='mt-6 rounded-lg border-gray-3 border-[2px] shadow p-4 text-center'>
        <p className='text-xs text-gray-500 mb-1'>일반 계좌라면 냈을 세금</p>
        <p className='text-lg font-bold text-gray-800'>
          {Math.floor(taxData.generalAccountTax).toLocaleString()} 원
        </p>
      </div>

      <div className='mt-6'>
        <p className='text-sm text-gray-500 mb-1'>
          남은 비과세 한도&nbsp;
          <span className='font-medium text-gray-700'>
            {Math.floor(taxData.remainingTaxFreeLimit).toLocaleString()}원
          </span>
        </p>
        <div className='h-3 w-full bg-gray-200 rounded-md overflow-hidden'>
          <div
            className='h-full bg-hana-green transition-all'
            style={{
              width: `${
                ((taxData.limit - taxData.remainingTaxFreeLimit) /
                  taxData.limit) *
                100
              }%`,
            }}
          />
        </div>
        <p className='text-xs text-gray mt-2'>
          사용 한도: {Math.round(taxData.usedLimit).toLocaleString()} 원
        </p>
      </div>

      <button className='mt-6 w-full flex justify-center items-center gap-2 py-2 bg-hana-green text-white rounded-md font-semibold hover:bg-green-600 transition'>
        <Wallet className='w-4 h-4' />
        자동이체로 한도 채우기
      </button>
    </div>
  );
};

export default Calculate;
