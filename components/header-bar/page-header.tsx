'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import HeaderBar from './header-bar';
import MainHeader from './main-header-bar';
import Sidebar from './side-bar';

export default function PageHeader() {
  const pathname = usePathname();
  const { title, subtitle } = useHeader();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div
      className='fixed top-0 left-0 z-50 inset-x-0
      mx-auto max-w-[768px] w-full'
    >
      {pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/' ? null : pathname === '/main' ? (
        <MainHeader
          title='안녕하세요, OOO 님!'
          subtitle='오늘도 현명한 투자하세요'
          onMenuClick={openSidebar}
        />
      ) : pathname === '/mypage' ? (
        <MainHeader
          title='마이페이지'
          subtitle='당신의 금융 발자취를 확인해보세요'
          onMenuClick={openSidebar}
        />
      ) : (
        <HeaderBar
          title={title}
          subtitle={subtitle}
          onMenuClick={openSidebar}
        />
      )}

      {/* 사이드바 */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
    </div>
  );
}
