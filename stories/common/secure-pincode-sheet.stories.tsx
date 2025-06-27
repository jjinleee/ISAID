// src/components/PinCodeSheet.stories.tsx
'use client';

import '../../app/globals.css';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import PinCodeSheet from '@/components/secure-pin-modal';

export default {
  title: 'Components/PinCodeSheet',
  component: PinCodeSheet,
  decorators: [
    (Story) => (
      <div className='relative w-full h-screen bg-gray-50'>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    // visible 은 내부에서 제어하므로 패널에서 숨김
    visible: { table: { disable: true } },
  },
} as Meta<typeof PinCodeSheet>;

type Story = StoryObj<typeof PinCodeSheet>;

const submitAction = action('onSubmit');
const closeAction = action('onClose');

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);

    return (
      <PinCodeSheet
        {...args}
        visible={open}
        onClose={() => {
          setOpen(false); // ✨ 수동 닫기
          closeAction();
        }}
        onSubmit={async (pin: string) => {
          submitAction(pin);
          await new Promise((r) => setTimeout(r, 400)); // 테스트용 지연
          const success = pin === '123456';
          if (success)
            setOpen(false); // ✨ 123456 이면 자동 닫기
          else setOpen(true); // 실패 → 그대로 유지
          return success;
        }}
      />
    );
  },
};
