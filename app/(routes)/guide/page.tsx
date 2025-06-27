import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import GuidePageContainer from './_components/guide-page-container';

const GuidePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='px-4 py-5 space-y-6'>
      <GuidePageContainer session={session} />
    </div>
  );
};

export default GuidePage;
