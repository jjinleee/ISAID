import Image from 'next/image';
import { securitiesMeta } from '@/data/bank-data';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface BankSelectSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (bank: string) => void;
}

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

              <div className='w-full inline-flex p-2 mb-6 cursor-pointer text-xl font-semibold border-b border-b-gray-2'>
                증권사
              </div>

              <div className='grid gap-4 custom-grid'>
                {securitiesMeta.map(({ name, icon }) => (
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
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BankSelectSheet;
