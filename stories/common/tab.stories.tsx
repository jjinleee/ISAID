'use client';

import '../../app/globals.css';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import Tab from '@/components/tab';

export default {
  title: 'Components/Tab',
  component: Tab,
  decorators: [
    (Story) => (
      <div className='flex w-full max-w-md border-b border-gray-200'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' },
    rounded: { control: 'boolean' },
    active: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof Tab>;

type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    text: '기본정보',
    rounded: false,
    active: false,
  },
};

export const Active: Story = {
  args: {
    text: '활성 탭',
    rounded: false,
    active: true,
  },
};

export const Rounded: Story = {
  args: {
    text: '라운드',
    rounded: true,
    active: false,
  },
};

export const RoundedActive: Story = {
  args: {
    text: '라운드 활성',
    rounded: true,
    active: true,
  },
};
