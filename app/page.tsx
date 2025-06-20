import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import RootPageContainer from '@/components/root/root-page-container';
import { authOptions } from '@/lib/auth-options';

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  // if (session) {
  //   redirect('/main');
  // }

  return (
    <div>
      <RootPageContainer />
    </div>
  );
};

export default HomePage;
