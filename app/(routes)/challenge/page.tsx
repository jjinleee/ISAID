import { getChallenges } from '@/app/actions/get-challenge';
import ChallengePageContainer from './_components/challenge-page-container';

const ChallengePage = async () => {
  const challenges = await getChallenges();
  console.log(challenges);
  return (
    <div className='px-4 py-5 space-y-6'>
      <ChallengePageContainer challenges={challenges} />
    </div>
  );
};

export default ChallengePage;
