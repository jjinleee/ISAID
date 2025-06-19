'use client';

import { ChartData } from '@/types/my-page';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface EtfDetailRatioChartProps {
  data: ChartData[];
  onClickItem: (id: string) => void;
}

const COLORS = [
  '#5eead4',
  '#2dd4bf',
  '#14b8a6',
  '#0f766e',
  '#a7f3d0',
  '#34d399',
  '#059669',
  '#047857',
  '#064e3b',
  '#083f2e',
];

export default function EtfDetailRatioChart({
  data,
  onClickItem,
}: EtfDetailRatioChartProps) {
  // console.log('data : ', data);

  return (
    <div className='flex flex-col gap-5 w-full'>
      <div className='flex items-center justify-center w-full gap-4 flex-col'>
        <ResponsiveContainer width={274} height={274}>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              labelLine={false}
              label={false}
              stroke='none'
            >
              {data.map((item, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                  onClick={() => onClickItem(String(item.id))}
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
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)}%`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
        {data.map((item, idx) => (
          <li key={idx} className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <span
                className='inline-block w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className='font-medium'>{item.name}</span>
            </div>
            <span className='text-gray-500'>{item.value.toFixed(2)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
