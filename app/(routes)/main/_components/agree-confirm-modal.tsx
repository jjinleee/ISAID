'use client';

import { useEffect } from 'react';

interface AgreeConfirmModalProps {
  onClose: () => void;
}

export default function AgreeConfirmModal({ onClose }: AgreeConfirmModalProps) {
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [onClose]);

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div
        className='relative z-10 w-[90%] max-w-md bg-white rounded-2xl px-6 py-8 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 동의 확인 문구 */}
        <div className='flex flex-col gap-2 text-sm text-gray-800 leading-relaxed'>
          <span>
            <strong>{today}</strong> 기준으로, 아래 항목에 대해 동의합니다.
          </span>
          <ul className='list-disc pl-5 text-gray-700 space-y-1'>
            <li>ETF 리워드 수령 동의</li>
            <li>개인정보 제공 동의</li>
            <li>보상 처리 안내 수신 동의</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className='mt-6 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition'
        >
          확인
        </button>
      </div>
    </div>
  );
}
