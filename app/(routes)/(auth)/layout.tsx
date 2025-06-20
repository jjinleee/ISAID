import '@/app/globals.css';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='pt-14 scrollbar-hide'>{children}</div>;
}
