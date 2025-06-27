// src/components/BottomTab.stories.tsx
'use client';

import '../../app/globals.css'; // Tailwind 전역 CSS
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import BottomTab from '@/components/bottom-bar/bottom-tab';

/* ── 데모용 간단한 SVG 아이콘 ─────────────────────────────── */
const DemoIcon = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    stroke='currentColor'
    fill='none'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
    <path d='M12 8v4l2 2' />
  </svg>
);
/* ────────────────────────────────────────────────────────── */

export default {
  title: 'Components/BottomTab',
  component: BottomTab,

  decorators: [
    (Story) => (
      // 하단 탭바 느낌을 보기 위한 래퍼
      <div className='w-full max-w-xs mx-auto bg-white border-t border-gray-200 flex justify-around'>
        <Story />
      </div>
    ),
  ],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    text: { control: 'text' },
    active: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof BottomTab>;

type Story = StoryObj<typeof BottomTab>;

export const Inactive: Story = {
  args: {
    Icon: DemoIcon,
    text: '홈',
    active: false,
  },
};

export const Active: Story = {
  args: {
    Icon: DemoIcon,
    text: '홈',
    active: true,
  },
};
