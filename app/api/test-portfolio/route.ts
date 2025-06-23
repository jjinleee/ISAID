import { NextResponse } from 'next/server';
import { getISAPortfolio } from '@/app/actions/get-isa-portfolio';

export async function GET() {
  try {
    const result = await getISAPortfolio('2025-03-30');
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
