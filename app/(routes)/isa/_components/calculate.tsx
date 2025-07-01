'use client';

import Image from 'next/image';
import { DollarSign, Trophy } from 'lucide-react';

/* ─────────────────────────
   1) 공통 유틸
   ───────────────────────── */
const format = (n: number) => n.toLocaleString('ko-KR');

/* ─────────────────────────
   2) “일상 금액” 카드 1개
   ───────────────────────── */
const PriceItem = ({
  src,
  label,
  amount,
  unit,
}: {
  src: string;
  label: string;
  amount: number;
  unit: string;
}) => (
  <div className='flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white/70 p-3 shadow-sm'>
    <Image src={src} alt={label} width={28} height={28} priority />
    <p className='text-xs text-gray-500'>{label}</p>
    <p className='text-base font-bold text-gray-700'>
      {format(amount)}
      <span className='ml-0.5 text-[11px] font-medium text-gray-500'>
        {unit}
      </span>
    </p>
  </div>
);

/* ─────────────────────────
   3) 메인 컴포넌트
   ───────────────────────── */
export default function Calculate({
  taxData,
  userName,
}: {
  taxData: any;
  userName: string;
}) {
  /* (1) 아낀 세금 */
  const savedTax = Math.floor(taxData.savedTax);

  /* (2) 일상 지출 단가 & 환산 */
  const PRICE = {
    coffees: 4_500, // 아메리카노
    netflixs: 5_500, // 넷플릭스 스탠다드(1인)
    youtubes: 14_900, // 유튜브 프리미엄
    beamins: 3_900, // 배민 클럽
    coupangs: 7_890, // 쿠팡 로켓와우
    gpts: 30_000, // ChatGPT Plus
  };

  const amounts: Record<string, number> = Object.fromEntries(
    Object.entries(PRICE).map(([k, v]) => [k, Math.floor(savedTax / v)])
  );

  /* (3) “일상 금액” 표시 메타 */
  const priceMeta = [
    {
      src: '/images/isa/tax-report/starbucks.svg',
      label: '아메리카노',
      valueKey: 'coffees',
      unit: '잔',
    },
    {
      src: '/images/isa/tax-report/netflix.svg',
      label: '넷플릭스 1인 요금',
      valueKey: 'netflixs',
      unit: '개월',
    },
    {
      src: '/images/isa/tax-report/coupang.svg',
      label: '로켓와우',
      valueKey: 'coupangs',
      unit: '개월',
    },
    {
      src: '/images/isa/tax-report/chat-gpt.svg',
      label: 'ChatGPT 구독',
      valueKey: 'gpts',
      unit: '개월',
    },
    {
      src: '/images/isa/tax-report/baemin.svg',
      label: '배민 클럽',
      valueKey: 'beamins',
      unit: '개월',
    },
    {
      src: '/images/isa/tax-report/youtube.svg',
      label: '유튜브 프리미엄',
      valueKey: 'youtubes',
      unit: '개월',
    },
  ];

  return (
    <div className='mt-4 rounded-xl bg-white px-5 py-6 shadow-sm sm:px-10'>
      {/* ───────────────── 상단: 절세 리포트 제목 */}
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <Trophy className='h-5 w-5 text-hana-green' />
          <p className='text-lg font-semibold'>{userName}님의 절세 리포트</p>
        </div>
        <p className='pl-8 text-xs text-gray-400'>
          나는 지금까지 얼마나 현명한 투자를 하고 있었을까? 절세 리포트를 통해
          확인해 보세요!
        </p>
      </div>

      {/* ───────────────── 절세 금액 */}
      <div className='mt-6 flex gap-2'>
        <DollarSign className='h-6 w-6 text-hana-green' />
        <div>
          <p className='text-sm text-gray-500'>
            일반계좌 대비 지금까지 아낀 세금
          </p>
          <p className='text-2xl font-extrabold text-hana-green'>
            {format(savedTax)} 원
          </p>
        </div>
      </div>

      {/* ───────────────── 일상 금액 카드 */}
      <p className='mt-6 pl-1 text-sm font-medium text-gray-600'>
        💡 일상 속으로 환산하면?
      </p>
      <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {priceMeta.map(({ src, label, valueKey, unit }) => (
          <PriceItem
            key={valueKey}
            src={src}
            label={label}
            amount={amounts[valueKey]}
            unit={unit}
          />
        ))}
      </div>

      {/* ───────────────── 남은 비과세 한도 */}
      <div className='mt-8'>
        <p className='mb-1 text-sm text-gray-500'>
          남은 비과세 한도&nbsp;
          <span className='font-medium text-gray-700'>
            {format(Math.floor(taxData.remainingTaxFreeLimit))}원
          </span>
        </p>
        <div className='h-3 w-full overflow-hidden rounded-md bg-gray-200'>
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
        <p className='mt-2 text-xs text-gray-400'>
          사용 한도: {format(Math.round(taxData.usedLimit))} 원
        </p>
      </div>
    </div>
  );
}
