'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, X } from 'lucide-react';
import Button from '@/components/button';
import { Input } from '@/components/ui/input';

interface Props {
  visible: boolean;
  onClose: () => void;
  videoUrl: string;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
};

const ShareSheet = ({ visible, onClose, videoUrl }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      toast.success('링크가 복사되었습니다.');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className='fixed inset-0 z-60 bg-black/40 max-w-[768px] mx-auto'
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={backdrop}
            onClick={onClose}
          />
          <div className='fixed bottom-0 left-0 right-0 z-60 flex justify-center'>
            <motion.div
              className='w-full max-w-[768px] bg-white rounded-t-2xl px-8 pt-8 pb-6 max-h-[80vh] overflow-y-auto'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={slideUp}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className='flex justify-end items-center'>
                <button onClick={onClose} className='cursor-pointer'>
                  <X className='w-6 h-6' />
                </button>
              </div>
              <div className='flex flex-col gap-6'>
                <h1 className='text-lg font-semibold text-start'>공유하기</h1>
                <div className='relative w-full'>
                  <Input
                    type='text'
                    readOnly
                    value={videoUrl}
                    className='w-full px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 text-center !focus:outline-none'
                  />
                </div>
                <div className='flex justify-center'>
                  <Button
                    text={copied ? '복사됨!' : '링크 복사'}
                    onClick={handleCopy}
                    thin={true}
                    className='!rounded-xl'
                    active={true}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareSheet;
