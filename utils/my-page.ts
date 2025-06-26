import { InvestType } from '@prisma/client';

export const convertToKorLabel = (enumValue: InvestType): string => {
  const map: Record<InvestType, string> = {
    CONSERVATIVE: '안정형',
    MODERATE: '안정추구형',
    NEUTRAL: '위험중립형',
    ACTIVE: '적극투자형',
    AGGRESSIVE: '공격투자형',
  };
  return map[enumValue] ?? '위험중립형';
};
