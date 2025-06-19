'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/components/button';

interface Props {
  visible: boolean;
  onClose: () => void;
  deleteAccount: () => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
};

const DeleteSheet = ({ visible, onClose, deleteAccount }: Props) => {
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
              <div className='flex justify-end'>
                <button onClick={onClose} className='cursor-pointer'>
                  <X className='w-6 h-6 self-end' />
                </button>
              </div>
              <div className='flex flex-col py-6 gap-8 '>
                <h1 className='text-xl w-full text-center'>
                  정말 삭제하시겠습니까 ?
                </h1>
                <div className='flex justify-center gap-4 w-full'>
                  <Button
                    text={'취소'}
                    thin={false}
                    active={true}
                    className={'!rounded-xl'}
                  />
                  <Button
                    text={'삭제하기'}
                    thin={false}
                    active={false}
                    className={'!rounded-xl'}
                    onClick={() => deleteAccount()}
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

export default DeleteSheet;
