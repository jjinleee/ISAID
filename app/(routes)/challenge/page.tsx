import { getChallenges } from '@/app/actions/get-challenge';
import checkIsaAccount from '@/utils/check-isa-account';
import NoIsaModal from '../main/_components/no-account-modal';
import ChallengePageContainer from './_components/challenge-page-container';

const ChallengePage = async () => {
  const challenges = await getChallenges();
  const hasIsaAccount = await checkIsaAccount();

  return (
    <div className='px-4 py-5 space-y-6'>
      {hasIsaAccount ? (
        <ChallengePageContainer challenges={await getChallenges()} />
      ) : (
        <NoIsaModal />
      )}
    </div>
  );
};

export default ChallengePage;
