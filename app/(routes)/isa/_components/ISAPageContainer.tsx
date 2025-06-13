import { useState } from 'react';
import TaxSavingCard from './TaxSavingCard';

const ISAPageContainer = () => {
  return (
    <>
      <div className='flex-col p-5 flex flex-1/2'>
        <TaxSavingCard />
      </div>
      <p></p>
    </>
  );
};

export default ISAPageContainer;
