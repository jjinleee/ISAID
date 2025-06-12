import type { ComponentType, SVGProps } from 'react';

export type TabProps = {
  text: string;
  active: boolean;
  rounded: boolean;
};

export type InputProps = {
  thin: boolean;
  type: string;
  placeholder: string;
  name: string;
  onChange? : (value : string) => void
};

export type ButtonProps = {
  text: string;
  thin: boolean;
  active: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: string;
};

export type QuestionOptionProps = {
  text: string;
  active?: boolean;
  onClick?: () => void;
};

export type CircleProps = {
  className?: string;
};

export type BottomTabProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>; // SVG 컴포넌트 타입
  text: string;
  active: boolean;
  onClick?: () => void;
};
