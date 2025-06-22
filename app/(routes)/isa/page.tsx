import { getTransactions } from '@/app/actions/get-trasactions';
import { taxSaving } from '@/app/actions/tax-saving';
import { convertTxs } from '@/utils/convert-data';
import ISAPageContainer from './_components/isa-page-container';

const ISAPage = async () => {
  const taxData = await taxSaving();

  const transactions = await getTransactions();
  console.log(transactions);

  return <ISAPageContainer taxData={taxData} transactions={transactions} />;
};

export default ISAPage;
