'use client';

import Image from 'next/image';
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
  const YOUTUBE = 14_900;
  const BEAMIN = 3_900;
  const COUPANG = 7_890;
  const CHAT_GPT = 30_000;

  const coffees = Math.floor(savedTax / COFFEE_PRICE);
  const netflixs = Math.floor(savedTax / NETFLIX_PRICE);
  const youtubes = Math.floor(savedTax / YOUTUBE);
  const beamins = Math.floor(savedTax / BEAMIN);
  const coupangs = Math.floor(savedTax / COUPANG);
  const gpts = Math.floor(savedTax / CHAT_GPT);

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
          <p className='text-sm text-gray-500'>
            일반계좌 대비 지금까지 아낀 세금
          </p>
          <p className='text-2xl font-extrabold text-hana-green'>
            {Math.floor(taxData.generalAccountTax).toLocaleString()} 원
          </p>
        </div>
      </div>

      <p className='text-sm text-gray-500 pl-8 mt-5'>
        일상 속의 금액으로 보여드릴게요!
      </p>
      <div className='mt-5 grid grid-cols-3 gap-4 text-center'>
        <div className='flex flex-col items-center'>
          <Image
            className='w-6 h-6 text-brown-500 mb-1'
            src={'/images/isa/tax-report/starbucks.svg'}
            width={10}
            height={10}
            alt='coffee'
          />
          <p className='text-sm text-gray-500'>아메리카노</p>
          <p className='font-semibold text-gray-700'>{coffees}잔</p>
        </div>
        <div className='flex flex-col items-center'>
          <Image
            className='w-6 h-6 text-brown-500 mb-1'
            src={'/images/isa/tax-report/netflix.svg'}
            width={10}
            height={10}
            alt='coffee'
          />
          <p className='text-sm text-gray-500'>넷플릭스 1인 요금</p>
          <p className='font-semibold text-gray-700'>{netflixs}개월</p>
        </div>

        <div className='flex flex-col items-center'>
          <Image
            className='w-6 h-6 text-brown-500 mb-1'
            src={'/images/isa/tax-report/coupang.svg'}
            width={10}
            height={10}
            alt='coffee'
          />
          <p className='text-sm text-gray-500'>로켓 와우 1달 요금</p>
          <p className='font-semibold text-gray-700'>{coupangs}개월</p>
        </div>

        <div className='flex flex-col items-center'>
          <Image
            className='w-6 h-6 text-brown-500 mb-1'
            src={'/images/isa/tax-report/chat-gpt.svg'}
            width={10}
            height={10}
            alt='coffee'
          />
          <p className='text-sm text-gray-500'>Chat GPT 구독 1달 요금</p>
          <p className='font-semibold text-gray-700'>{gpts}개월</p>
        </div>

        <div className='flex flex-col items-center'>
          <Image
            className='w-6 h-6 text-brown-500 mb-1'
            src={'/images/isa/tax-report/baemin.svg'}
            width={10}
            height={10}
            alt='coffee'
          />
          <p className='text-sm text-gray-500'>배민 클럽 1달 요금</p>
          <p className='font-semibold text-gray-700'>{beamins}개월</p>
        </div>

        <div className='flex flex-col items-center'>
          <Image
            className='w-6 h-6 text-brown-500 mb-1'
            src={'/images/isa/tax-report/youtube.svg'}
            width={10}
            height={10}
            alt='coffee'
          />
          <p className='text-sm text-gray-500'>유튜브 프리미엄 1달 요금</p>
          <p className='font-semibold text-gray-700'>{youtubes}개월</p>
        </div>
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
    </div>
  );
};

export default Calculate;
