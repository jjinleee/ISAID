import '@/app/globals.css';
import AuthHeader from '@/app/(routes)/(auth)/_component/header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pt-14">
        <AuthHeader />
        {children}
      </body>
    </html>
  );
}
