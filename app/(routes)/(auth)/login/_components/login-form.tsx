'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@/public/images/arrow-left.svg';
import StarBoy from '@/public/images/star-boy.svg';
import Button from '@/components/button';
import { CustomInput } from '@/components/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password: password.trim(),
      redirect: false,
    });

    if (res?.ok && !res.error) {
      router.push('/'); // 성공 시 홈으로 이동
    } else {
      setError('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLogin}
      className='pt-20 px-7 flex flex-col gap-10 max-w-sm mx-auto'
    >
      <div
        className='
        fixed top-0 left-0 right-0
        w-full max-w-[768px] mx-auto
        py-3 px-6'
        onClick={() => router.push('/')}
      >
        <ArrowLeft />
      </div>
      <div className='flex flex-col font-semibold text-subtitle'>
        <StarBoy />
        <p className='text-primary text-[20px]'>ISAID</p>
        <p>I Save And Invest Daily</p>
      </div>

      <div className='flex flex-col gap-6'>
        <label className='flex flex-col gap-2 text-gray'>
          이메일
          <CustomInput
            thin={false}
            name='email'
            type='email'
            value={email}
            onChange={(value) => setEmail(value)}
            placeholder='example@test.com'
          />
        </label>

        <label className='flex flex-col gap-2 text-gray'>
          비밀번호
          <CustomInput
            thin={false}
            name='password'
            type='password'
            value={password}
            onChange={(value) => setPassword(value)}
            placeholder='비밀번호를 입력해주세요.'
          />
        </label>
      </div>

      <Button
        type='submit'
        thin={false}
        active={true}
        disabled={loading}
        text={loading ? '로그인 중…' : '로그인'}
      />

      {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
    </form>
  );
}
