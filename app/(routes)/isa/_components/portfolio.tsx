'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import InvestmentStyle from '@/app/(routes)/isa/_components/investment-style';
import StarProRebalancing from '@/public/images/isa/star-pro-rebalancing.svg';
import {
  PieChartData,
  RebalancingOpinionData,
  RebalancingResponse,
} from '@/types/isa';
import { AlertCircle, ArrowRight, Bot, Rocket, Sparkles } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Portfolio = ({
  ptData,
  userName,
  rebalancingData,
}: {
  ptData: PieChartData[];
  userName: string;
  rebalancingData?: RebalancingResponse;
}) => {
  const [showScoreInfo, setShowScoreInfo] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabList = ['잘하고 있어요', '아쉬워요'];

  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log('rebalancingData : ', rebalancingData);
  }, [rebalancingData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowScoreInfo(false);
      }
    };

    if (showScoreInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showScoreInfo]);

  const COLORS = [
    '#5eead4',
    '#2dd4bf',
    '#14b8a6',
    '#0f766e',
    '#a7f3d0',
    '#009178',
  ].splice(0, ptData.length);

  // Bar chart styling constants
  const BAR_SIZE = 12; // px thickness of each bar
  const BAR_GAP = 10; // gap between bars in a group
  const BAR_CATEGORY_GAP = 30; // vertical gap between different categories

  const rebalancingOpinions = rebalancingData?.rebalancingOpinions ?? [];
  const properOpinions = rebalancingOpinions.filter((item) =>
    item.opinion.includes('적정 비중')
  );
  const improperOpinions = rebalancingOpinions.filter(
    (item) => !item.opinion.includes('적정 비중')
  );

  const properNames = properOpinions.map((item) => item.category);
  const improperNames = improperOpinions.map((item) => item.category);

  const properPtData = ptData.filter((item) => properNames.includes(item.name));
  const improperPtData = ptData.filter((item) =>
    improperNames.includes(item.name)
  );

  // console.log('ptData : ', ptData);
  console.log('properOpinions : ', properOpinions);
  console.log('improperOpinions : ', improperOpinions);
  console.log('properPtData : ', properPtData);
  console.log('improperPtData : ', improperPtData);

  const buildChartData = (
    pt: PieChartData[],
    ops: RebalancingOpinionData[]
  ) => {
    return ops.map((op) => {
      const ptItem = pt.find((p) => p.name === op.category);
      return {
        name: op.category,
        user: ptItem ? ptItem.value : op.userPercentage,
        recommended: op.recommendedPercentage,
      };
    });
  };

  const properChartData = buildChartData(properPtData, properOpinions);
  const improperChartData = buildChartData(improperPtData, improperOpinions);

  const properChartHeight =
    properChartData.length * (BAR_SIZE + BAR_CATEGORY_GAP) + 24;
  const improperChartHeight =
    improperChartData.length * (BAR_SIZE + BAR_CATEGORY_GAP) + 24;

  // ------------------------------------------------------------------
  // Derived UI variables for the selected tab
  const isProperTab = selectedTab === 0;
  const currentChartData = isProperTab ? properChartData : improperChartData;
  const currentChartHeight = isProperTab
    ? properChartHeight
    : improperChartHeight;
  const currentOpinions = isProperTab ? properOpinions : improperOpinions;
  const imageSrc = isProperTab
    ? '/images/isa/star-pro-rebalancing-proper.svg'
    : '/images/isa/star-pro-rebalancing.svg';
  const imageWidth = isProperTab ? 80 : 36;
  const textColorClass = isProperTab ? 'text-primary' : 'text-hana-red';
  // ------------------------------------------------------------------

  return (
    <div className='rounded-xl bg-white px-5 sm:px-10 py-6 shadow-sm mt-4'>
      <div className='flex gap-3 items-center'>
        <Rocket className='w-5 h-5 text-hana-green' />
        <h2 className='text-lg font-semibold'>
          {userName}님의 투자 포트폴리오
        </h2>
      </div>

      <p className='text-sm text-gray-500 mt-1 mb-4'>
        자산 구성, 한눈에 확인해 보세요!
      </p>

      <div className='flex items-center justify-around'>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={ptData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              startAngle={90}
              endAngle={450}
            >
              {ptData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#f9fafb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
              itemStyle={{ fontSize: '14px', color: '#111827' }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <ul className='space-y-2 ml-6 text-sm w-40'>
          {ptData.map((item, index) => (
            <li key={index} className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <span
                  className='inline-block w-2.5 h-2.5 rounded-full'
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className='font-medium'>{item.name}</span>
              </div>
              <span className='text-gray-500'>{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>

      {rebalancingData && (
        <div className='mt-6'>
          <div className='flex gap-3 items-center'>
            <Bot className='text-hana-green w-5 h-5' />
            <h2 className='text-lg font-semibold'>
              {userName}님의 안정추구형 성향에 맞춘 리밸런싱 제안이에요!
            </h2>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex gap-2 items-center rounded-xl bg-primary-2/10 p-4'>
              <p className='text-sm'>
                <strong className='text-lg'>
                  {rebalancingData?.score?.toFixed(2)}
                </strong>
                / 100 투자 핏 점수
              </p>
              <div ref={popoverRef} className='relative inline-block'>
                <AlertCircle
                  className='w-5 h-5 text-primary cursor-pointer'
                  onClick={() => setShowScoreInfo((prev) => !prev)}
                />
                {showScoreInfo && (
                  <div className='absolute left-1/2 -translate-x-1/2 top-[120%] z-10 w-max max-w-xs rounded-md bg-white px-3 py-2 text-xs text-gray-800 shadow-lg'>
                    해당 스코어는 투자 성향에 적합한 포트폴리오 비중을 기준으로
                    현재 포트폴리오 비중과 비교하여 산출한 점수입니다.
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-white' />
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-2 font-semibold'>
                {tabList.map((item, idx) => (
                  <div
                    key={idx}
                    className={` ${selectedTab === idx ? 'text-black' : 'text-gray-400'} cursor-pointer`}
                    onClick={() => {
                      setSelectedTab(idx);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className='flex flex-col gap-2 sm:flex-row-reverse'>
                <div className='w-full sm:w-[340px] flex gap-4 items-start'>
                  <ResponsiveContainer width='100%' height={currentChartHeight}>
                    <BarChart
                      data={currentChartData}
                      layout='vertical'
                      margin={{ left: 24, right: 16 }}
                      barCategoryGap={BAR_CATEGORY_GAP}
                    >
                      <XAxis type='number' domain={[0, 100]} hide />
                      <YAxis
                        dataKey='name'
                        type='category'
                        axisLine={false}
                        tickLine={false}
                        width={110}
                        interval={0}
                      />
                      <Bar
                        name='현재'
                        dataKey='user'
                        fill={'#14b8a6'}
                        radius={[0, 4, 4, 0]}
                        barSize={BAR_SIZE}
                      >
                        <LabelList
                          dataKey='user'
                          position='right'
                          formatter={(v: number) => `${v}%`}
                          offset={4}
                        />
                      </Bar>
                      <Bar
                        name='권장'
                        dataKey='recommended'
                        fill='#f1ca3b'
                        radius={[0, 4, 4, 0]}
                        barSize={BAR_SIZE}
                      >
                        <LabelList
                          dataKey='recommended'
                          position='right'
                          formatter={(v: number) => `${v}%`}
                          offset={4}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className='flex flex-col gap-2'>
                    {[
                      { label: '현재', color: '#14b8a6' },
                      { label: '권장', color: '#f1ca3b' },
                    ].map(({ label, color }) => (
                      <div key={label} className='flex items-center gap-1'>
                        <span
                          className='inline-block w-2.5 h-2.5 rounded-full'
                          style={{ backgroundColor: color }}
                        />
                        <span className='text-sm font-medium' style={{ color }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex flex-row gap-4 shadow-xl p-4 rounded-2xl'>
                  <Image
                    src={imageSrc}
                    alt='title'
                    width={imageWidth}
                    height={imageWidth}
                  />
                  <ul className='list-none'>
                    {currentOpinions.map((item, idx) => (
                      <li
                        key={idx}
                        className={`text-sm relative text-gray pl-4 before:content-['•'] before:absolute before:left-0 `}
                      >
                        {item.detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='mt-6 p-4 bg-hana-green/10 rounded-lg flex items-center justify-between'>
                  <div className='flex items-start gap-2'>
                    <Sparkles className='text-hana-green w-5 h-5 mt-0.5' />
                    <div>
                      <p className='font-medium text-gray-800 mb-1'>
                        전문가 모델 기반 리밸런싱을 원하시나요?
                      </p>
                      <div className='flex items-center gap-1 text-xs text-gray-500'>
                        <Bot className='w-3.5 h-3.5 text-gray-400' />
                        하나은행 AI 기반 ISA 포트폴리오 추천과 연동해보세요.
                      </div>
                    </div>
                  </div>
                  <button className='flex items-center gap-1 text-sm text-hana-green font-semibold hover:underline whitespace-nowrap'>
                    ISA 포트폴리오 연결하기
                    <ArrowRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>

            {/*<div className='bg-green-50 rounded-lg p-3 text-xs leading-relaxed text-gray-700'>*/}
            {/*  {generateRebalancingSummary(rebalancingOpinions)}*/}
            {/*</div>*/}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
