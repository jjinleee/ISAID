import { etfMetaMapData, questionReasonMapData } from '@/data/etf-test';
import { InvestType } from '@prisma/client';

export const convertToEnum = (riskType: string): InvestType => {
  const map: Record<string, InvestType> = {
    안정형: 'CONSERVATIVE',
    안정추구형: 'MODERATE',
    위험중립형: 'NEUTRAL',
    적극투자형: 'ACTIVE',
    공격투자형: 'AGGRESSIVE',
  };
  return map[riskType] ?? 'NEUTRAL'; // fallback
};
// 1. 리스크 성향 판단 (Q1~Q6 기준)
export const getRiskType = (answers: (number | null)[] = []): string => {
  if (!Array.isArray(answers) || answers.length < 6) return '안정형';

  const score = answers
    .slice(0, 6)
    .map((v) => v ?? 0)
    .reduce((acc, v) => acc + v, 0);

  if (score <= 6) return '안정형';
  if (score <= 10) return '안정추구형';
  if (score <= 15) return '위험중립형';
  if (score <= 20) return '적극투자형';
  return '공격투자형';
};

// 2. ETF 분류체계별 임팩트/해시태그 정보
const etfMetaMap: Record<
  string,
  { impact: string; hashtags: string[]; description: string }
> = etfMetaMapData;
// 3. 메타정보 추출 함수
const getMetaForType = (name: string) =>
  etfMetaMap[name] || { impact: '✨ 설명 준비중', hashtags: ['#ETF'] };

// 4. 질문 번호 ~ 선택지에 따른 분류체계/이유 매핑
const questionReasonMap: Record<
  number,
  Record<number, { types: string[]; reason: string }>
> = questionReasonMapData;

// 5. 최종 추천 타입 추출 함수 (count + reason + meta 통합)
export const getRecommendedTypesWithReasons = (
  answers: (number | null)[]
): {
  description: string;
  name: string;
  reason: string[];
  impact: string;
  hashtags: string[];
}[] => {
  if (!Array.isArray(answers) || answers.length < 16) return [];

  const counts: Record<string, number> = {};
  const reasonsMap: Record<string, string[]> = {};

  for (let i = 6; i <= 15; i++) {
    const answer = answers[i];
    if (answer == null) continue;

    const qMap = questionReasonMap[i];
    const entry = qMap?.[answer];
    if (!entry) continue;

    entry.types.forEach((type) => {
      counts[type] = (counts[type] || 0) + 1;
      if (!reasonsMap[type]) reasonsMap[type] = [];
      if (!reasonsMap[type].includes(entry.reason)) {
        reasonsMap[type].push(entry.reason);
      }
    });
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => ({
      name,
      reason: reasonsMap[name] ?? ['-'],
      ...getMetaForType(name),
    }));
};

export const getEtfResult = (answers: (number | null)[]) => {
  const riskType = getRiskType(answers);
  const topTypes = getRecommendedTypesWithReasons(answers).map((r) => r.name);
  return { riskType, topTypes };
};
