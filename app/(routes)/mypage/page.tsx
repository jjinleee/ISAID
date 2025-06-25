import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import MyPageContainer from './_components/my-page-container';
import MyPageContainer2 from './_components/my-page-container-2';

const MyPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  // return <MyPageContainer session={session} />;
  return <MyPageContainer2 session={session} />;
};

export default MyPage;
