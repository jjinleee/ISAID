// 예: app/api/testMonthly/route.ts
import { NextResponse } from 'next/server';
import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';

export async function GET() {
  await getMonthlyReturns(6, '2025-02-28');
  return NextResponse.json({ ok: true });
}
