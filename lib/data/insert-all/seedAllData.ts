import { seedEtfHoldings } from '../etf/etf-holding';
import { seedEtfHoldingSnapshots } from '../etf/etf-holding-snapshot';
import { seedEtfTransactions } from '../etf/etf-transactions';
import { seedGeneralHoldings } from '../general/general-holding';
import { seedGeneralHoldingSnapshots } from '../general/general-holding-snapshot';
import { seedGeneralTransactions } from '../general/general-transactions';

export async function seedAllData(isaAccountId: bigint) {
  await seedEtfTransactions(isaAccountId);
  await seedEtfHoldings(isaAccountId);
  await seedEtfHoldingSnapshots(isaAccountId);
  await seedGeneralTransactions(isaAccountId);
  await seedGeneralHoldings(isaAccountId);
  await seedGeneralHoldingSnapshots(isaAccountId);
}
