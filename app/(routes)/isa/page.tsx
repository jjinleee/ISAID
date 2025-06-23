import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';
import { getTransactions } from '@/app/actions/get-trasactions';
import { taxSaving } from '@/app/actions/tax-saving';
import { MonthlyReturnsSummary } from '@/types/isa';
import ISAPageContainer from './_components/isa-page-container';

const ISAPage = async () => {
  const taxData = await taxSaving();
  const monthlyReturnsData: MonthlyReturnsSummary = await getMonthlyReturns(
    new Date().toISOString().slice(0, 10)
  );

  const transactions = await getTransactions();
  // console.log(transactions);
  console.log('monthlyReturnsData : ', monthlyReturnsData);
  // 이러한 구조의 데이터를 각 월별로

  return (
    <ISAPageContainer
      taxData={taxData}
      transactions={transactions}
      monthlyReturnsData={monthlyReturnsData}
    />
  );
};

export default ISAPage;
