import './globals.css';
// import BottomBar from '@/components/bottom-bar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`pt-10`}>
        {children}
        {/*<BottomBar />*/}
      </body>
    </html>
  );
}
