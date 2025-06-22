'use server';

import { redirect } from 'next/navigation';

export async function login(_prev: { message?: string }, formData: FormData) {
  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  const ok = email === 'test@example.com' && password === '1234';

  if (!ok) return { message: '이메일이나 비밀번호가 일치하지 않습니다.' };

  redirect('/');
}
