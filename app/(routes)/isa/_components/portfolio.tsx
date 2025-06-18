'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import InvestmentStyle from './investment-style';

const data = [
  { name: '국내 주식', value: 35 },
  { name: '해외 주식', value: 25 },
  { name: '채권', value: 20 },
  { name: 'ETF/리츠', value: 15 },
  { name: '현금', value: 5 },
];

const COLORS = ['#5eead4', '#2dd4bf', '#14b8a6', '#0f766e', '#a7f3d0'];

const Portfolio = () => {
  return (
    <div className='rounded-xl bg-white px-5 sm:px-10 py-6 shadow-sm mt-4'>
      <h2 className='text-lg font-semibold'>OO님의 투자 포트폴리오</h2>
      <p className='text-sm text-gray-500 mt-1 mb-4'>
        자산 구성, 한눈에 확인해 보세요!
      </p>

      <div className='flex items-center justify-between'>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
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
              {data.map((entry, index) => (
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
          {data.map((item, index) => (
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
      <InvestmentStyle />
    </div>
  );
};

export default Portfolio;
