'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BottomChart from '@/public/images/bottom-chart';
import Home from '@/public/images/home';
import PiggyBank from '@/public/images/piggy-bank';
import BottomTab from './bottom-tab';

const items = [
  { to: '/isa', text: 'ISA', icon: PiggyBank },
  { to: '/', text: 'Home', icon: Home },
  { to: '/etf', text: 'ETF', icon: BottomChart },
];

export const BottomBar = () => {
  const pathname = usePathname();

  const hiddenPaths = ['/register', '/login'];
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <div
      className='
      fixed bottom-0 inset-x-0
      mx-auto max-w-[768px] w-full
      flex justify-around space-x-8 items-center
      border-t-[1.5px] border-t-gray-2 bg-white
      z-50
      '
    >
      {items.map(({ to, text, icon: Icon }) => {
        const isActive =
          to === '/' ? pathname === '/' : pathname.startsWith(to);
        return (
          <Link href={to} key={to}>
            <BottomTab key={to} active={isActive} text={text} Icon={Icon} />
          </Link>
        );
      })}
    </div>
  );
};
export default BottomBar;
