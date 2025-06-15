'use client';

import { useEffect, useRef, useState } from 'react';

type Option = { label: string; value: string };
interface Props<T extends string> {
  value: T;
  options: Option[];
  onChangeAction: (v: T) => void;
  className?: string;
}

export default function CustomSelect<T extends string>({
  value,
  options,
  onChangeAction,
  className = '',
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='h-full flex items-center justify-between border border-gray-2 rounded-xl gap-3 px-3 py-4 text-sm bg-white w-28'
      >
        {options.find((o) => o.value === value)?.label}
        <svg
          className={`w-6 h-6 text-gray transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox='0 0 20 20'
        >
          <path
            d='M5 7l5 5 5-5'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.5}
          />
        </svg>
      </button>

      {open && (
        <ul className='absolute left-0 top-full mt-1 z-10 w-28 border border-gray-2 bg-white rounded-xl shadow-md'>
          {options.map((o) => (
            <li
              key={o.value}
              onClick={() => {
                onChangeAction(o.value as T);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                o.value === value ? 'font-semibold text-primary' : ''
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
