'use client';

import '../../app/globals.css';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import BottomTab from '@/components/bottom-bar/bottom-tab';

const DemoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox='0 0 24 24'
    stroke='currentColor'
    fill='none'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <circle cx='12' cy='12' r='10' />
    <path d='M12 8v4l2 2' />
  </svg>
);

export default {
  title: 'Components/BottomTab',
  component: BottomTab,

  decorators: [
    (Story) => (
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
