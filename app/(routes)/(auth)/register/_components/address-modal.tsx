'use client';

import '@/app/globals.css';
import { useEffect, useState } from 'react';

interface AddressSearchProps {
  onComplete: (address: string) => void;
  onClose: () => void;
  openState: boolean;
}

export default function AddressSearch({
  onComplete,
  onClose,
  openState,
}: AddressSearchProps) {
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    console.log('openState', openState);
  }, []);

  useEffect(() => {
    const container = document.getElementById('address-search-container');
    if (!container) return;

    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        onComplete(data.address);
        handleClose();
      },
    }).embed(container);
  }, []);

  useEffect(() => {
    if (openState) {
      const a = document.getElementById('address-search-container');
      const firstChild = a?.firstElementChild;
      if (firstChild) {
        const iframe = firstChild?.firstElementChild;

        firstChild.setAttribute(
          'style',
          'width: 100%; min-height: 600px; max-height: 600px;'
        );
        iframe?.setAttribute('style', 'width: 100%; height: 100vh');
        console.log('firstChild', firstChild);
        console.log('iframe', iframe);
      }
    }
  }, [openState]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0  flex items-end w-full">
      <div className="absolute inset-0 z-50 bg-black opacity-50"></div>
      <div
        className={`w-full h-[70%] bg-white rounded-t-3xl z-51 ${
          isClosing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b ">
          <div></div>
          <h2 className="text-lg font-medium">집주소 검색</h2>
          <button onClick={handleClose} className="p-2 -mr-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div id="address-search-container" className="w-full h-full" />
      </div>
    </div>
  );
}
