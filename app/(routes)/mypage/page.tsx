import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const MyPage = async () => {
  // const session = await getServerSession(authOptions);
  // console.log('session', session);
  return <div></div>;
};

export default MyPage;
