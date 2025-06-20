'use client';

import { usePathname } from 'next/navigation';

export default function BodyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRoot = pathname === '/';

  return (
    <div
      className={`scrollbar-hide antialiased ${isRoot ? '' : 'pt-20 pb-20 '}`}
    >
      {children}
    </div>
  );
}
