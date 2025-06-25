import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { taxSaving } from '@/app/actions/tax-saving';
import { authOptions } from '@/lib/auth-options';
import MainPageContainer from './_components/main-page-container';

const MainPage = async () => {
  const session = await getServerSession(authOptions);
  const { savedTax } = await taxSaving();

  return (
    <div>
      <MainPageContainer
        userName={session?.user.name || ''}
        savedTax={Math.floor(savedTax)}
      />
    </div>
  );
};

export default MainPage;
