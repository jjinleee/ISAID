'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CONTENT_MAX = 768; // 본문 최대 폭 (px)
const SIDEBAR_W = 320; // w-64 → 16 rem = 256 px

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
            className={`fixed inset-0 z-30 bg-black/40 ${
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
              className='fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-xl'
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
              className='fixed inset-y-0 z-40 w-full max-w-[768px] overflow-hidden pointer-events-none'
              style={{
                left: `${containerLeft}px`,
              }}
            >
              <motion.aside
                className='absolute inset-y-0 w-80 bg-white shadow-xl'
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
    <div className='h-full bg-white flex flex-col overflow-y-auto scrollbar-hide'>
      {/* 프로필 헤더 */}
      <div className='bg-primary text-white p-4 relative'>
        <button
          aria-label='닫기'
          onClick={onClose}
          className='absolute top-4 right-4 text-white hover:text-gray-200 text-xl w-6 h-6 flex items-center justify-center'
        >
          ✕
        </button>
        <div className='flex items-center space-x-3 mb-3'>
          <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden'>
            <div className='w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 text-sm font-medium'>
              🐶
            </div>
          </div>
          <div>
            <div className='font-medium text-lg'>000님</div>
            <div className='text-teal-100 text-sm'>안녕하세요</div>
          </div>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className='flex-1 bg-gray-50'>
        {/* 내 정보 섹션 */}
        <div className='bg-white mb-2'>
          <div className='px-4 py-3 text-xs font-medium text-gray-500 border-b border-gray-100'>
            내 정보
          </div>
          <MenuItem icon='👤' label='내 정보 보기' onClick={onClose} />
        </div>

        {/* ISA 섹션 */}
        <div className='bg-white mb-2'>
          <div className='px-4 py-3 text-xs font-medium text-gray-500 border-b border-gray-100'>
            ISA
          </div>
          <MenuItem icon='📚' label='금융초보가이드' onClick={onClose} />
          <MenuItem icon='📈' label='상품 추천' onClick={onClose} />
          <MenuItem icon='📊' label='절세 계산기' onClick={onClose} />
        </div>

        {/* ETF 섹션 */}
        <div className='bg-white mb-2'>
          <div className='px-4 py-3 text-xs font-medium text-gray-500 border-b border-gray-100'>
            ETF
          </div>
          <MenuItem icon='⏰' label='테마 추천' onClick={onClose} />
          <MenuItem icon='📊' label='백테스팅' onClick={onClose} />
        </div>

        {/* 하단 메뉴 */}
        <div className='bg-white'>
          <MenuItem icon='⚙️' label='설정' onClick={onClose} />
          <MenuItem
            icon='🚪'
            label='로그아웃'
            onClick={onClose}
            className='text-red-500'
          />
        </div>
      </div>
    </div>
  );
}

/* 메뉴 아이템 컴포넌트 */
function MenuItem({
  icon,
  label,
  onClick,
  className = '',
}: {
  icon: string;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${className}`}
    >
      <div className='flex items-center space-x-3'>
        <span className='text-lg'>{icon}</span>
        <span className='text-gray-800 font-medium'>{label}</span>
      </div>
      <svg
        className='w-4 h-4 text-gray-400'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 5l7 7-7 7'
        />
      </svg>
    </button>
  );
}
