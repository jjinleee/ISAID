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
};

export type ButtonProps = {
  text: string;
  thin: boolean;
  active: boolean;
  onClick?: () => void;
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

export type MainHeaderProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export type HeaderBarProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};
