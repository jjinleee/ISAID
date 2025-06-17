import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import MyPageContainer from './_components/my-page-container';

const MyPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return <MyPageContainer session={session} />;
};

export default MyPage;
