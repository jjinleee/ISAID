import type { ComponentType, SVGProps } from 'react';
import type { FormData } from '@/app/(routes)/(auth)/register/_components/register-form';

export type TabProps = {
  text: string;
  active: boolean;
  rounded: boolean;
  onClick: () => void;
};

export type InputProps = {
  thin: boolean;
  type: string;
  placeholder: string;
  name: string;
  field?: keyof FormData;
  value?: string;
  displayValue?: string;
  onChangeField?: (field: keyof FormData, value: string) => void;
  onChange?: (value: string) => void;
};

export type ButtonProps = {
  text: string;
  thin: boolean;
  active: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: string;
  className?: string;
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

export type SlideCardProps = {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
  category: string;
  onClick?: () => void;
};

export type LoadingProps = {
  text: string;
};
