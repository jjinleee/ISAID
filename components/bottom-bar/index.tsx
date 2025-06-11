'use client';

import { usePathname } from 'next/navigation';
import BottomTab from './bottom-tab';
import PiggyBank from '@/public/images/piggy-bank';
import Home from '@/public/images/home';
import BottomChart from '@/public/images/bottom-chart';
import Link from 'next/link';

const items = [
  { to: '/isa', text: 'ISA', icon: PiggyBank },
  { to: '/', text: 'Home', icon: Home },
  { to: '/etf', text: 'ETF', icon: BottomChart },
];

export const BottomBar = () => {
  const pathname = usePathname();
  return (
    <div
      className="fixed bottom-0 w-full flex justify-around inset-x-0
      items-center border-t border-t-hana-green bg-white
      "
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
