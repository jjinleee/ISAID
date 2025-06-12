import Script from 'next/script';
import RegisterContainer from './_components/register-form';

export default function LoginPage() {
  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="beforeInteractive"
      />
      <RegisterContainer />
    </>
  );
}
