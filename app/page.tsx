import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/main');
  }

  return <div></div>;
};

export default HomePage;
