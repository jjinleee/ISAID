import { getServerSession } from 'next-auth';
import { getISAPortfolio } from '@/app/actions/get-isa-portfolio';
import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';
import { getTransactions } from '@/app/actions/get-trasactions';
import { taxSaving } from '@/app/actions/tax-saving';
import {
  AssetCategory,
  MonthlyReturnsSummary,
  PieChartData,
} from '@/types/isa';
import checkIsaAccount from '@/utils/check-isa-account';
import { authOptions } from '@/lib/auth-options';
import ISAPageContainer from './_components/isa-page-container';
import ISAPageContainerWhenHasnot from './_components/isa-page-container-when-hasnot';

const ISAPage = async () => {
  const hasIsa = await checkIsaAccount();
  if (!hasIsa) {
    // 계좌가 없으면 아무것도 렌더링하지 않음
    return <ISAPageContainerWhenHasnot />;
  }

  const taxData = await taxSaving();
  const monthlyReturnsData: MonthlyReturnsSummary =
    await getMonthlyReturns('6');

  const rawData: AssetCategory[] = await getISAPortfolio('2025-06-30');
  const session = await getServerSession(authOptions);

  const totalPercentage = rawData.reduce(
    (sum, item) => sum + item.percentage,
    0
  );

  const ptData: PieChartData[] = (() => {
    const data = rawData.map((item) => ({
      name: item.category,
      value: +((item.percentage / totalPercentage) * 100).toFixed(1),
    }));
    const sum = data.reduce((acc, cur) => acc + cur.value, 0);
    const diff = +(100 - sum).toFixed(1);
    if (data.length > 0) {
      data[data.length - 1].value = +(
        data[data.length - 1].value + diff
      ).toFixed(1);
    }
    return data
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  })();

  const transactions = await getTransactions();

  return (
    <ISAPageContainer
      taxData={taxData}
      transactions={transactions}
      ptData={ptData}
      userName={session?.user.name || 'OO'}
      monthlyReturnsData={monthlyReturnsData}
    />
  );
};

export default ISAPage;
