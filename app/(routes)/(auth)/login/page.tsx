import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import LoginContainer from './_components/login-form';

const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/main');
  }

  return (
    <div>
      <LoginContainer />
    </div>
  );
};

export default LoginPage;
