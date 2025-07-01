import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Script from 'next/script';
import RootPageContainer from '@/components/root/root-page-container';
import { authOptions } from '@/lib/auth-options';

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  // if (session) {
  //   redirect('/main');
  // }

  return (
    <div>
      <Script
        src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        strategy='beforeInteractive'
      />
      <RootPageContainer />
    </div>
  );
};

export default HomePage;
