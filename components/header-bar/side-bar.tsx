'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CONTENT_MAX = 768; // 본문 최대 폭 (px)
const SIDEBAR_W = 256; // w-64 → 16 rem = 256 px

/* 컨테이너의 left offset 계산 (768px 콘텐츠 영역의 시작점) */
const calcContainerLeft = () => {
  const screenWidth = window.innerWidth;
  return screenWidth > CONTENT_MAX ? (screenWidth - CONTENT_MAX) / 2 : 0;
};

export default function Sidebar({ isOpen, onClose }: Props) {
  /* 컨테이너 left offset 상태 */
  const [containerLeft, setContainerLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* 창 크기 변화마다 containerLeft 갱신 및 모바일 체크 */
  useEffect(() => {
    const handler = () => {
      const screenWidth = window.innerWidth;
      setContainerLeft(calcContainerLeft());
      setIsMobile(screenWidth <= CONTENT_MAX);
    };
    handler(); // 초기값 설정
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* 배경 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 - 전체 화면 덮음 */}
          <motion.div
            className={`fixed inset-0 z-30 bg-[#424242]/50 ${
              isMobile ? '' : 'max-w-[768px]'
            }`}
            style={
              isMobile
                ? {}
                : {
                    left: `${containerLeft}px`,
                  }
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* 사이드바 컨테이너 */}
          {isMobile ? (
            /* 모바일: 전체 화면 오른쪽에서 슬라이드 */
            <motion.aside
              className='fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-xl'
              initial={{ x: SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: SIDEBAR_W }}
              transition={{
                type: 'tween',
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          ) : (
            /* 데스크톱: 768px 마스킹 컨테이너 내에서 슬라이드 */
            <div
              className='fixed inset-y-0 z-40 w-full max-w-[768px] overflow-hidden'
              style={{
                left: `${containerLeft}px`,
              }}
            >
              <motion.aside
                className='absolute inset-y-0 w-64 bg-white shadow-xl'
                initial={{
                  x: CONTENT_MAX,
                }}
                animate={{
                  x: CONTENT_MAX - SIDEBAR_W, // 768px - 256px = 512px (오른쪽 끝 위치)
                }}
                exit={{
                  x: CONTENT_MAX,
                }}
                transition={{
                  type: 'tween',
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <SidebarContent onClose={onClose} />
              </motion.aside>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

/* 사이드바 콘텐츠 컴포넌트 분리 */
function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* 헤더 */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-800'>메뉴</h2>
        <button
          aria-label='닫기'
          onClick={onClose}
          className='text-gray-500 hover:text-gray-700 text-xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
        >
          ✕
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <nav className='flex flex-col py-4'>
        <Link
          href='/'
          onClick={onClose}
          className='px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500'
        >
          홈
        </Link>
        <a
          href='/mypage'
          onClick={onClose}
          className='px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500'
        >
          마이페이지
        </a>
        <a
          href='/about'
          onClick={onClose}
          className='px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500'
        >
          소개
        </a>
        <a
          href='/contact'
          onClick={onClose}
          className='px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500'
        >
          연락처
        </a>
        <div className='px-6 py-4'>
          <div className='border-t border-gray-200'></div>
        </div>
        <a
          href='/settings'
          onClick={onClose}
          className='px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500'
        >
          설정
        </a>
        <a
          href='/logout'
          onClick={onClose}
          className='px-6 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-l-4 border-transparent hover:border-red-500'
        >
          로그아웃
        </a>
      </nav>
    </>
  );
}
