'use client';

import '../../app/globals.css';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProgressBar from '@/components/progress-bar';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    current: { control: { type: 'number', min: 0 } },
    total: { control: { type: 'number', min: 1 } },
    hideStatus: { control: 'boolean' },
    className: { control: 'text' },
  },
} as Meta<typeof ProgressBar>;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { current: 3, total: 10, hideStatus: false },
};

export const Complete: Story = {
  args: { current: 10, total: 10, hideStatus: false },
};

export const HiddenStatus: Story = {
  args: { current: 5, total: 10, hideStatus: true },
};
