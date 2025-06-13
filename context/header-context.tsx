'use client';

import { createContext, useContext, useState } from 'react';

interface HeaderContextProps {
  title: string;
  subtitle?: string;
  setHeader: (title: string, subtitle?: string) => void;
}

const HeaderContext = createContext<HeaderContextProps | null>(null);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('default');
  const [subtitle, setSubtitle] = useState<string | undefined>();

  const setHeader = (newTitle: string, newSubtitle?: string) => {
    setTitle(newTitle);
    setSubtitle(newSubtitle);
  };

  return (
    <HeaderContext.Provider value={{ title, subtitle, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used inside HeaderProvider');
  return ctx;
};
