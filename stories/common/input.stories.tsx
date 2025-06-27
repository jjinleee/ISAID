'use client';

import '../../app/globals.css';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CustomInput from '@/components/input';

export default {
  title: 'Components/CustomInput',
  component: CustomInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-full max-w-sm p-4 mx-auto'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
    },
    thin: { control: 'boolean' },
    placeholder: { control: 'text' },
    field: { table: { disable: true } },
    onChangeField: { table: { disable: true } },
    onChange: { action: 'changed' },
    displayValue: { control: 'text' },
    autocomplete: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CustomInput>;

type Story = StoryObj<typeof CustomInput>;

export const Default: Story = {
  args: {
    type: 'text',
    thin: false,
    placeholder: 'Enter text...',
    value: '',
  },
};

export const Thin: Story = {
  args: {
    type: 'text',
    thin: true,
    placeholder: 'Thin input...',
    value: '',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    thin: false,
    placeholder: 'Enter number...',
    value: '',
  },
};

export const WithDisplayValue: Story = {
  args: {
    type: 'text',
    thin: false,
    placeholder: 'Hidden behind overlay',
    value: '12345',
    displayValue: '★ 12345 ★',
  },
};
