'use client';

import { useState } from 'react';
import Image from 'next/image';
import { bankMeta, securitiesMeta } from '@/data/bank-data';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Tab from '@/components/tab';

interface BankSelectSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (bank: string) => void;
}

const banks = [
  '하나',
  '신한',
  'KB국민',
  '우리',
  'SC제일',
  '기업',
  '농협',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
];

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
};

const BankSelectSheet = ({
  visible,
  onClose,
  onSelect,
}: BankSelectSheetProps) => {
  const tabs = ['은행', '증권사'];
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            className='fixed inset-0 z-60 bg-black/40 max-w-[768px] mx-auto'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={backdrop}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <div className='fixed bottom-0 left-0 right-0 z-60 flex justify-center'>
            <motion.div
              className='w-full max-w-[768px] bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={slideUp}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className='flex justify-between items-center mb-4'>
                <p className='text-lg font-semibold'>
                  은행 혹은 증권사를 선택해 주세요
                </p>
                <button onClick={onClose}>
                  <X className='w-6 h-6' />
                </button>
              </div>

              <div className='inline-flex bg-gray-100 p-1 rounded-lg mb-6 cursor-pointer'>
                {tabs.map((label, idx) => (
                  <button
                    key={label}
                    onClick={() => setSelectedTab(idx)}
                    className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 cursor-pointer
        ${selectedTab === idx ? 'bg-hana-green text-white font-semibold' : 'text-gray-500 font-semibold'}
      `}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className='grid grid-cols-3 gap-4'>
                {(selectedTab === 0 ? bankMeta : securitiesMeta).map(
                  ({ name, icon }) => (
                    <button
                      key={name}
                      className='flex items-center cursor-pointer gap-2 p-3 shadow rounded-lg text-sm'
                      onClick={() => {
                        onSelect(name);
                        onClose();
                      }}
                    >
                      <Image
                        src={icon}
                        alt={`${name} 아이콘`}
                        width={24}
                        height={24}
                        className='object-cover rounded-lg'
                      />
                      <span>{name}</span>
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BankSelectSheet;
