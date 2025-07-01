import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import RegisterContainer from './_components/register-form';

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/main');
  }

  return (
    <div>
      <RegisterContainer />
    </div>
  );
};

export default RegisterPage;
