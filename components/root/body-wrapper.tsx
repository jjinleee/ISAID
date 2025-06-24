'use client';

import { usePathname } from 'next/navigation';

export default function BodyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRoot = pathname === '/';
  const paddingClass = isRoot ? '' : 'pt-18 pb-20';

  return (
    <div className={`scrollbar-hide antialiased ${paddingClass}`}>
      {children}
    </div>
  );
}
