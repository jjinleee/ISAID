'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NoIsaModalProps {
  onClose?: () => void; // 외부에서도 닫기 콜백을 걸 수 있게 선택형
}

export default function NoIsaModal({ onClose }: NoIsaModalProps) {
  const router = useRouter();

  /** ESC 키 = 닫기 */
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  /** 모달 종료 + 메인 이동 */
  const handleClose = () => {
    onClose?.();
    router.replace('/isa');
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center'>
      {/* 반투명 오버레이 */}
      <div className='absolute inset-0 bg-black/40' onClick={handleClose} />
      {/* 모달 카드 */}
      <div
        className='relative z-10 w-[90%] max-w-md rounded-2xl bg-white px-6 py-8 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 안내 문구 */}
        <h2 className='text-lg font-bold text-gray-800'>
          ISA 계좌가 연결되어 있지 않습니다
        </h2>
        <p className='mt-2 text-sm leading-relaxed text-gray-600'>
          챌린지 참여 및 소수점&nbsp;ETF 리워드를 받으려면
          <br className='hidden sm:block' />
          &nbsp;먼저&nbsp;<strong>ISA 계좌</strong>를 연결해 주세요.
        </p>

        <button
          onClick={handleClose}
          className='mt-6 w-full cursor-pointer rounded-lg bg-hana-green py-2 font-semibold text-white transition hover:bg-hana-green/90'
        >
          연결하러 가기
        </button>
      </div>
    </div>
  );
}
