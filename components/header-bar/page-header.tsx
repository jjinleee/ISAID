'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import SecurePinModal from '@/components/secure-pin-modal';
import { verifyPin } from '@/lib/api/my-page';
import { isPinVerified, setPinVerified } from '@/lib/session';
import HeaderBar from './header-bar';
import MainHeader from './main-header-bar';

// import Sidebar from './side-bar';

export default function PageHeader() {
  const pathname = usePathname();
  const { title, subtitle } = useHeader();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const handleVerifyPin = async (pin: string) => {
    const res = await verifyPin(pin);
    if (!res.success) {
      toast.error('비밀번호가 올바르지 않습니다.');
      return false;
    }
    setPinVerified();
    setTimeout(() => {
      setModalOpen(false);
      router.push('/mypage');
    }, 300);
    return true;
  };

  const userClick = () => {
    if (pathname === '/mypage') return;

    if (isPinVerified()) {
      router.push('/mypage');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div
      className='fixed top-0 left-0 z-50 inset-x-0
      mx-auto max-w-[768px] w-full'
    >
      {pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/' ? null : pathname === '/main' ||
        pathname === '/isa' ||
        pathname === '/guide' ||
        pathname === '/etf' ? (
        <MainHeader title={title} subtitle={subtitle} onMenuClick={userClick} />
      ) : pathname === '/mypage' ? (
        <MainHeader
          title='마이페이지'
          subtitle='당신의 금융 발자취를 확인해보세요'
          onMenuClick={userClick}
        />
      ) : (
        <HeaderBar title={title} subtitle={subtitle} onMenuClick={userClick} />
      )}

      <SecurePinModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleVerifyPin}
      />
    </div>
  );
}
