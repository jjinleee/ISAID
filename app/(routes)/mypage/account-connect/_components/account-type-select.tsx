'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  type: string;
  kind: string;
  onChangeType: (value: string) => void;
  onChangeKind: (value: string) => void;
  typeError?: string;
  kindError?: string;
}

const AccountSelectSection = ({
  type,
  kind,
  onChangeType,
  onChangeKind,
  typeError,
  kindError,
}: Props) => {
  const typeOptions = ['일반형', '서민형'];
  const kindOptions = ['중개형', '신탁형', '일임형'];

  const [openMenu, setOpenMenu] = useState<'type' | 'kind' | null>(null);

  return (
    <div className='flex flex-col gap-4'>
      {/* 계좌 유형 선택 */}
      <div className='relative w-full'>
        <button
          type='button'
          onClick={() =>
            setOpenMenu((prev) => (prev === 'type' ? null : 'type'))
          }
          className='w-full rounded-md p-3 shadow-md text-sm text-left bg-white border border-gray-200 flex items-center justify-between focus:outline-none focus:border-hana-green focus:ring-1 focus:ring-hana-green'
        >
          <span className={type ? 'text-black' : 'text-gray-400'}>
            {type || '계좌 유형을 선택해 주세요'}
          </span>
          <Image
            src='/images/common/arrow-down.svg'
            alt='arrow'
            width={16}
            height={16}
            className='ml-2'
          />
        </button>

        {typeError && (
          <p className='text-xs text-red-500 mt-3 pl-1'>{typeError}</p>
        )}

        {openMenu === 'type' && (
          <ul className='absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md text-sm'>
            {typeOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChangeType(opt);
                  setOpenMenu(null);
                }}
                className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 운용 방식 선택 */}
      <div className='relative w-full'>
        <button
          type='button'
          onClick={() =>
            setOpenMenu((prev) => (prev === 'kind' ? null : 'kind'))
          }
          className='w-full rounded-md p-3 shadow-md text-sm text-left bg-white border border-gray-200 flex items-center justify-between focus:outline-none focus:border-hana-green focus:ring-1 focus:ring-hana-green'
        >
          <span className={kind ? 'text-black' : 'text-gray-400'}>
            {kind || '운용 방식을 선택해 주세요'}
          </span>
          <Image
            src='/images/common/arrow-down.svg'
            alt='arrow'
            width={16}
            height={16}
            className='ml-2'
          />
        </button>

        {kindError && (
          <p className='text-xs text-red-500 mt-3 pl-1'>{kindError}</p>
        )}

        {openMenu === 'kind' && (
          <ul className='absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md text-sm'>
            {kindOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChangeKind(opt);
                  setOpenMenu(null);
                }}
                className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountSelectSection;
