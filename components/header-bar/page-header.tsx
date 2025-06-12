'use client';

import { usePathname } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import HeaderBar from './header-bar';
import MainHeader from './main-header-bar';

export default function PageHeader() {
  const pathname = usePathname();
  const { title, subtitle } = useHeader();

  if (pathname === '/login' || pathname == '/register') {
    return null;
  }

  if (pathname === '/') {
    return (
      <MainHeader
        title='안녕하세요, OOO 님!'
        subtitle='오늘도 현명한 투자하세요'
      />
    );
  }

  if (pathname === '/mypage') {
    return (
      <MainHeader
        title='마이페이지'
        subtitle='당신의 금융 발자취를 확인해보세요'
      />
    );
  }

  return <HeaderBar title={title} subtitle={subtitle} />;
}
