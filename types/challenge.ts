export const ChallengeCodes = {
  ATTEND_7DAYS: 'ATTEND_7DAYS',
  QUIZ_DAILY: 'QUIZ_DAILY',
  FIRST_INVEST_TEST: 'FIRST_INVEST_TEST',
  FIRST_CONNECT_ISA: 'FIRST_CONNECT_ISA',
  HOLD_ETF_3PLUS: 'HOLD_ETF_3PLUS',
  HOLD_ACCOUNT_500DAYS: 'HOLD_ACCOUNT_500DAYS',
  YEARLY_DEPOSIT: 'YEARLY_DEPOSIT',
} as const;

export type ChallengeCode =
  (typeof ChallengeCodes)[keyof typeof ChallengeCodes];
