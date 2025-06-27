'use client';

import '../../app/globals.css';
import React from 'react';
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BottomBar from '@/components/bottom-bar';

const withPathname = (pathname: string) => {
  // eslint-disable-next-line react/display-name
  return (Story: React.FC) => (
    <PathnameContext.Provider value={pathname}>
      <div className='relative w-full h-screen bg-gray-50'>
        <Story />
      </div>
    </PathnameContext.Provider>
  );
};

export default {
  title: 'Components/BottomBar',
  component: BottomBar,
  parameters: { layout: 'fullscreen' },
} as Meta<typeof BottomBar>;

type Story = StoryObj<typeof BottomBar>;

export const HomeActive: Story = { decorators: [withPathname('/main')] };
export const IsaActive: Story = { decorators: [withPathname('/isa')] };
export const EtfActive: Story = { decorators: [withPathname('/etf')] };
export const GuideActive: Story = { decorators: [withPathname('/guide')] };
