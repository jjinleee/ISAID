import { taxSaving } from '@/app/actions/tax-saving';
import ISAPageContainer from './_components/isa-page-container';

const ISAPage = async () => {
  const result = await taxSaving();
  console.log(result);
  return <ISAPageContainer taxData={result} />;
};

export default ISAPage;
