import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import ETFPageContainer from './_components/etf-page-container';

const ETFPage = async () => {
  const session = await getServerSession(authOptions);
  return <ETFPageContainer session={session} />;
};

export default ETFPage;
