import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { taxSaving } from '@/app/actions/tax-saving';
import checkIsaAccount from '@/utils/check-isa-account';
import { authOptions } from '@/lib/auth-options';
import MainPageContainer from './_components/main-page-container';

const MainPage = async () => {
  const session = await getServerSession(authOptions);

  const hasAccount = await checkIsaAccount();
  let savedTax = 0;
  if (hasAccount) {
    const { savedTax: s } = await taxSaving(); // ← 구조분해로 꺼내기
    savedTax = s;
  }

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
