import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import MainPageContainer from './_components/main-page-container';

const MainPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <MainPageContainer userName={session?.user.name || ''} />
    </div>
  );
};

export default MainPage;
