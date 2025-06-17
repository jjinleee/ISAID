import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Script from 'next/script';
import { authOptions } from '@/lib/auth-options';
import RegisterContainer from './_components/register-form';

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/main');
  }

  return (
    <div>
      <Script
        src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        strategy='beforeInteractive'
      />
      <RegisterContainer />
    </div>
  );
};

export default RegisterPage;
