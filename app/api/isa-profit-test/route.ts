// 예: app/api/testMonthly/route.ts
import { NextResponse } from 'next/server';
import { getMonthlyReturns } from '@/app/actions/get-monthly-returns';

export async function GET() {
  await getMonthlyReturns('6');
  return NextResponse.json({ ok: true });
}
