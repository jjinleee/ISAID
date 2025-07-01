// lib/api/etf-test.ts
import { InvestType } from '@prisma/client';

export async function submitEtfMbtiResult({
  investType,
  preferredCategories,
}: {
  investType: InvestType;
  preferredCategories: string[];
}) {
  const res = await fetch('/api/etf/mbti', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ investType, preferredCategories }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '서버 오류가 발생했습니다.');
  }

  return res.json();
}
