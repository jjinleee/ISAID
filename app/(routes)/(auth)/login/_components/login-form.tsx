'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions/login';
import StarBoy from '@/public/images/star-boy.svg';
import Button from '@/components/button';
import { Input } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      thin={false}
      active={true}
      disabled={pending}
      text={pending ? '로그인 중…' : '로그인'}
    ></Button>
  );
}

const initialState = { message: '' };

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="border pt-10 px-7 flex flex-col gap-10 max-w-sm mx-auto"
    >
      <div className="flex flex-col  font-semibold text-subtitle">
        <StarBoy />
        <p className="text-primary text-[20px]">ISAID</p>
        <p>I Save And Invest Daily</p>
      </div>

      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-2 text-gray">
          이메일
          <Input
            thin={false}
            name="email"
            type="email"
            placeholder="example@test.com"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray">
          비밀번호
          <Input
            thin={false}
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
          />
        </label>
      </div>

      <SubmitButton />
      {state.message && (
        <p className="text-red-500 text-center mt-2">{state.message}</p>
      )}
    </form>
  );
}
