'use client';

import {
  BarChart2,
  Coffee,
  DollarSign,
  Hash,
  Monitor,
  Percent,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';

interface TaxData {
  savedTax: number; // 절세로 아낀 세금
  isaProfitBeforeDeduction: number; // ISA 공제 전 수익
  generalAccountTax: number; // 일반계좌 세금
}

const format = (n: number) => n.toLocaleString('ko-KR');

const Calculate = ({ taxData }: { taxData: TaxData }) => {
  // 소수점 제거
  const savedTax = Math.floor(taxData.savedTax);
  const profitBeforeDeduct = Math.floor(taxData.isaProfitBeforeDeduction);
  const generalAccountTax = Math.floor(taxData.generalAccountTax);

  // 💡 오늘까지 투자 개월 수 (예시: 6개월)
  const monthsInvested = 6; // 실제로는 서버에서 보내주셔도 좋아요

  // 💡 비과세 한도
  const taxFreeLimit = 2_000_000;
  const allowanceLeft = Math.max(0, taxFreeLimit - profitBeforeDeduct);

  // 💡 ISA 과세 대상 수익
  const taxableIncome = Math.max(0, profitBeforeDeduct - taxFreeLimit);

  // 💡 월평균 절세액
  const avgSavedPerMonth = Math.floor(savedTax / monthsInvested);

  // 💡 절세율
  const savingRate =
    generalAccountTax === 0 ? 0 : (savedTax / generalAccountTax) * 100;

  // 💡 환산 체감 단위
  const COFFEE_PRICE = 4_500;
  const NETFLIX_PRICE = 5_500;
  const coffees = Math.floor(savedTax / COFFEE_PRICE);
  const netflixs = Math.floor(savedTax / NETFLIX_PRICE);

  return (
    <section className='max-w-3xl mx-auto p-4 space-y-6'>
      {/* —————————————————————————————— */}
      {/* 토스 느낌의 리포트 헤더 */}
      <div className='bg-white p-5 rounded-xl shadow flex items-center'>
        <BarChart2 className='text-teal-600 mr-3' size={28} />
        <div>
          <h3 className='text-lg font-bold text-gray-800'>절세 리포트</h3>
          <p className='mt-1 text-sm text-gray-500'>
            지금까지 절세한 현황을 한눈에 확인해보세요
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* 1. 절세 금액 카드 */}
        <div className='flex flex-col bg-white p-5 rounded-xl shadow hover:shadow-lg transition'>
          <div className='flex items-center'>
            <div className='p-3 bg-teal-100 rounded-full text-teal-600 mr-4'>
              <PiggyBank size={24} />
            </div>
            <div>
              <p className='text-sm text-gray-600'>지금까지 아낀 세금</p>
              <p className='mt-1 text-2xl font-bold text-teal-600'>
                {format(savedTax)}원
              </p>
            </div>
          </div>
          <div className='mt-3 text-xs text-gray-500 flex items-center'>
            <Coffee className='mr-1' size={14} /> 아메리카노 {coffees}
            잔&nbsp;&nbsp;
            <Monitor className='mr-1 ml-2' size={14} /> 넷플릭스 {netflixs}달
          </div>
          <p className='mt-2 text-2xs text-gray-400'>
            ※ 환산 기준: ☕ {format(COFFEE_PRICE)}원 / 📺{' '}
            {format(NETFLIX_PRICE)}원
          </p>
        </div>

        {/* 2. 남은 절세 가능 금액 */}
        <div className='flex items-center bg-white p-5 rounded-xl shadow hover:shadow-lg transition'>
          <div className='p-3 bg-orange-100 rounded-full text-orange-600 mr-4'>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className='text-sm text-gray-600'>남은 비과세 한도</p>
            <p className='mt-1 text-2xl font-bold text-gray-800'>
              {format(allowanceLeft)}원
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              더 투자하면 이만큼 더 절세할 수 있어요
            </p>
          </div>
        </div>

        {/* 3. 월평균 절세액 */}
        <div className='flex items-center bg-white p-5 rounded-xl shadow hover:shadow-lg transition'>
          <div className='p-3 bg-indigo-100 rounded-full text-indigo-600 mr-4'>
            <Hash size={24} />
          </div>
          <div>
            <p className='text-sm text-gray-600'>월평균 절세액</p>
            <p className='mt-1 text-2xl font-bold text-indigo-600'>
              {format(avgSavedPerMonth)}원
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              매달 이 정도 절세하고 있어요
            </p>
          </div>
        </div>

        {/* 4. 일반계좌 세금 */}
        <div className='flex items-center bg-white p-5 rounded-xl shadow hover:shadow-lg transition'>
          <div className='p-3 bg-red-100 rounded-full text-red-600 mr-4'>
            <DollarSign size={24} />
          </div>
          <div>
            <p className='text-sm text-gray-600'>일반계좌 세금</p>
            <p className='mt-1 text-2xl font-bold text-gray-800'>
              {format(generalAccountTax)}원
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              같은 수익을 일반계좌로 냈다면 이만큼 세금 냈을 거예요
            </p>
          </div>
        </div>

        {/* 5. ISA 과세 대상 수익 */}
        <div className='flex items-center bg-white p-5 rounded-xl shadow hover:shadow-lg transition'>
          <div className='p-3 bg-purple-100 rounded-full text-purple-600 mr-4'>
            <Monitor size={24} />
          </div>
          <div>
            <p className='text-sm text-gray-600'>ISA 과세 대상 수익</p>
            <p className='mt-1 text-2xl font-bold text-purple-600'>
              {format(Math.floor(taxData.isaProfitBeforeDeduction))}원
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              이 금액에 대해 ISA에서 과세가 적용됩니다
            </p>
          </div>
        </div>
      </div>

      {/* 6. 절세율 카드 (풀 너비) */}
      <div className='bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center'>
        <div className='flex justify-center items-center mb-2'>
          <Percent className='text-teal-600 mr-2' size={28} />
          <p className='text-lg font-medium text-gray-600'>절세율</p>
        </div>
        <p className='text-4xl font-extrabold text-teal-600'>
          {savingRate.toFixed(1)}%
        </p>
      </div>
    </section>
  );
};

export default Calculate;
