import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';
import { getISAPortfolio } from '@/app/actions/get-isa-portfolio';
import { getTransactions } from '@/app/actions/get-trasactions';
import { taxSaving } from '@/app/actions/tax-saving';
import { AssetCategory, PieChartData } from '@/types/isa';
import { MonthlyReturnsSummary } from '@/types/isa';
import ISAPageContainer from './_components/isa-page-container';

const ISAPage = async () => {
  const taxData = await taxSaving();
  const monthlyReturnsData: MonthlyReturnsSummary = await getMonthlyReturns(
    new Date().toISOString().slice(0, 10)
  );

  const rawData: AssetCategory[] = await getISAPortfolio('2025-06-30');

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
  // console.log(transactions);
  console.log('monthlyReturnsData : ', monthlyReturnsData);

  return (
    <ISAPageContainer
      taxData={taxData}
      transactions={transactions}
      ptData={ptData}
      monthlyReturnsData={monthlyReturnsData}
    />
  );
};

export default ISAPage;
