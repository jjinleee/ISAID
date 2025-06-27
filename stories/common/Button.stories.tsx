'use client';

import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '@/components/button';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    thin: { control: 'boolean' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    className: { control: 'text' },
  },
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    thin: false,
    active: true,
    disabled: false,
  },
};

export const Thin: Story = {
  args: {
    text: 'Thin Button',
    thin: true,
    active: false,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    text: 'Disabled Button',
    thin: false,
    active: false,
    disabled: true,
  },
};

export const CustomClass: Story = {
  args: {
    text: 'Custom Class Button',
    thin: false,
    active: false,
    disabled: false,
    className: '!bg-gray',
  },
};
