'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<boolean>;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0 },
};

export default function PinCodeSheet({ visible, onClose, onSubmit }: Props) {
  const [pin, setPin] = useState('');
  const [digits, setDigits] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) setPin((prev) => prev + digit);
  };

  const handleDelete = () => setPin((prev) => prev.slice(0, -1));
  const handleReset = () => setPin('');

  const generateShuffledDigits = (): string[] => {
    const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  };

  useEffect(() => {
    setDigits(generateShuffledDigits());
  }, []);

  useEffect(() => {
    if (visible) {
      setPin('');
      setDigits(generateShuffledDigits());
    }
  }, [visible]);

  useEffect(() => {
    if (pin.length === 6 && !isVerifying) {
      const verify = async () => {
        setIsVerifying(true);
        const success = await onSubmit(pin);
        if (!success) setPin('');
        setIsVerifying(false);
      };
      verify();
    }
  }, [pin]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            className='fixed inset-0 z-60 bg-black/40 max-w-[768px] mx-auto '
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={backdrop}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <div className='fixed bottom-0 left-0 right-0 z-60 flex justify-center '>
            <motion.div
              className='w-full max-w-[768px] bg-white h-[70vh] px-6 pt-8 pb-10 rounded-t-2xl'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={slideUp}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-end mb-4'>
                <button onClick={onClose} className='cursor-pointer'>
                  <X className='w-6 h-6' />
                </button>
              </div>

              <div className='text-center mb-6'>
                <h2 className='text-lg font-semibold'>
                  비밀번호 6자리를 입력하세요
                </h2>
              </div>

              {/* PIN 입력 상태 표시 */}
              <div className='flex justify-center gap-3 mb-8'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 ${
                      i < pin.length ? 'bg-black' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Keypad */}
              <div className='grid grid-cols-3 gap-3 mb-3'>
                {digits.slice(0, 9).map((digit, i) => (
                  <button
                    key={i}
                    className='bg-primary text-white text-xl py-3 rounded-lg'
                    onClick={() => handleDigit(digit)}
                  >
                    {digit}
                  </button>
                ))}
              </div>

              {/* 마지막 줄 */}
              <div className='grid grid-cols-3 gap-3'>
                <button
                  onClick={handleReset}
                  className='text-sm text-gray-700 underline py-3'
                >
                  전체삭제
                </button>

                <button
                  onClick={() => handleDigit(digits[9])}
                  className='bg-primary text-white text-xl py-3 rounded-lg'
                >
                  {digits[9]}
                </button>

                <button
                  onClick={handleDelete}
                  className='text-xl text-gray-700 py-3'
                >
                  ⌫
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
