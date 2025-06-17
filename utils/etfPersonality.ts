// utils/etfPersonality.ts

/**
 * 투자 성향(리스크 성향) 판단
 */
export const getRiskType = (answers: (number | null)[] = []): string => {
  if (!Array.isArray(answers) || answers.length < 6) return '안정형'; // 보호

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

/**
 * 후반부 답변을 바탕으로 추천 ETF 분류체계 상위 3개 추출
 */
export const getRecommendedTypes = (
  answers: (number | null)[] = []
): { name: string; impact: string; hashtags: string[] }[] => {
  if (!Array.isArray(answers) || answers.length < 16) return [];

  const mapping = [
    { q: 6, types: ['주식-업종섹터-생활소비재', '주식-전략-가치'] },
    { q: 7, types: ['주식-업종섹터-건설', '주식-업종섹터-산업재'] },
    { q: 8, types: ['주식-전략-성장', '주식-업종섹터-정보기술'] },
    { q: 9, types: ['주식-시장대표', '주식-전략-구조화'] },
    { q: 10, types: ['주식-업종섹터-헬스케어', '주식-전략-혼합/퀀트'] },
    { q: 11, types: ['주식-업종섹터-커뮤니케이션서비스', '주식-전략-변동성'] },
    { q: 12, types: ['혼합자산-주식+채권', '주식-전략-전략테마'] },
    { q: 13, types: ['주식-전략-기업그룹', '주식-규모-대형주'] },
    { q: 14, types: ['주식-전략-가치', '주식-업종섹터-철강소재'] },
    { q: 15, types: ['주식-업종테마', '주식-업종섹터-중공업'] },
  ];

  const counts: Record<string, number> = {};
  mapping.forEach(({ q, types }) => {
    const selected = answers[q];
    if (selected !== null && selected !== undefined) {
      const index = selected % types.length;
      const type = types[index];
      counts[type] = (counts[type] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => ({
      name,
      ...getMetaForType(name),
    }));
};

/**
 * ETF 분류체계별 임팩트 문구 및 해시태그 제공
 */
const getMetaForType = (
  name: string
): { impact: string; hashtags: string[] } => {
  const dict: Record<string, { impact: string; hashtags: string[] }> = {
    '주식-시장대표': {
      impact: '📊 시장 전체에 베팅!',
      hashtags: ['#코스피200', '#대표지수', '#넓게간다'],
    },
    '주식-전략-가치': {
      impact: '💎 저평가 헌터',
      hashtags: ['#가치주', '#저평가기기업', '#내재가치'],
    },
    '주식-전략-성장': {
      impact: '🚀 미래 먹거리 픽!',
      hashtags: ['#성장주', '#미래유망기업', '#고성장'],
    },
    '주식-전략-혼합/퀀트': {
      impact: '🧠 데이터로 승부',
      hashtags: ['#알고리즘', '#팩터투자', '#기계픽'],
    },
    '주식-전략-구조화': {
      impact: '📐 구조의 마법사',
      hashtags: ['#분할전략', '#시장중립', '#헤지'],
    },
    '주식-전략-전략테마': {
      impact: '🎯 트렌드 사냥꾼',
      hashtags: ['#메가트렌드', '#테마형', '#미래가치'],
    },
    '주식-전략-기업그룹': {
      impact: '🏢 대기업이 좋아요',
      hashtags: ['#그룹주', '#지주사', '#대기업'],
    },
    '주식-전략-변동성': {
      impact: '⚡ 고위험 감당러',
      hashtags: ['#고변동성', '#시장베팅', '#스릴투자'],
    },
    '주식-업종섹터-정보기술': {
      impact: '🧠 테크 천재',
      hashtags: ['#IT', '#반도체', '#인공지능'],
    },
    '주식-업종섹터-헬스케어': {
      impact: '🧬 헬시코인 좋아함',
      hashtags: ['#바이오', '#의료산업', '#건강테크'],
    },
    '주식-업종섹터-생활소비재': {
      impact: '🛒 실생활 소비 집중',
      hashtags: ['#필수소비재', '#유통', '#소비트렌드'],
    },
    '주식-업종섹터-산업재': {
      impact: '🏗️ 제조 강국 믿음',
      hashtags: ['#제조업', '#중장비', '#수출중심'],
    },
    '주식-업종섹터-건설': {
      impact: '🏙️ 인프라의 미래',
      hashtags: ['#부동산', '#건설사', '#스마트시티'],
    },
    '주식-업종섹터-철강소재': {
      impact: '⛓️ 산업의 근본파',
      hashtags: ['#철강', '#기초소재', '#기반산업'],
    },
    '주식-업종섹터-중공업': {
      impact: '⚙️ 무거운 거 좋아요',
      hashtags: ['#중공업', '#기계산업', '#조선'],
    },
    '주식-업종섹터-커뮤니케이션서비스': {
      impact: '📱 소통 혁신러',
      hashtags: ['#통신주', '#콘텐츠', '#SNS플랫폼'],
    },
    '주식-업종테마': {
      impact: '🌐 세상을 읽는 안목',
      hashtags: ['#테마ETF', '#ESG', '#메가트렌드'],
    },
    '주식-규모-대형주': {
      impact: '🏦 묵직한 안정감',
      hashtags: ['#삼성전자', '#현대차', '#대형주'],
    },
    '혼합자산-주식+채권': {
      impact: '💰 리스크 반반무!',
      hashtags: ['#분산투자', '#균형형ETF', '#중립포트'],
    },
  };

  return (
    dict[name] || {
      impact: '✨ 설명 준비중',
      hashtags: ['#ETF'],
    }
  );
};
