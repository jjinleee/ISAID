import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { HeaderProvider } from '@/context/header-context';
import BottomBar from '@/components/bottom-bar';
import PageHeader from '@/components/header-bar/page-header';
import BodyWrapper from '@/components/root/body-wrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ISAID',
  description: '디지털 하나로 1차 프로젝트',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} scrollbar-hide`}
      >
        <HeaderProvider>
          <PageHeader />
          <Toaster position='top-center' />
          <BodyWrapper>{children}</BodyWrapper>
          <BottomBar />
        </HeaderProvider>
      </body>
    </html>
  );
}
