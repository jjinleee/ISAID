import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/solapi';

export async function POST(req: Request) {
  const { phone, code } = await req.json();

  try {
    await sendSMS(phone, code);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('❌ 문자 전송 실패:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
