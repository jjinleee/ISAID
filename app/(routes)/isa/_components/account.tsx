import { AccountIcon } from '@/public/images/isa/account-icon';

const Account = () => {
  return (
    <div className='w-full shadow rounded-lg p-4'>
      <div className='flex gap-2'>
        <div className='mt-1'>
          <AccountIcon />
        </div>
        <div>
          <p className='font-semibold'>하나은행 ISA 계좌 [중개형]</p>
          <div className='flex gap-2 items-center'>
            <p className='text-gray-4'>592-910508-29670</p>
            <p className='text-gray-400 underline text-xs cursor-pointer'>
              복사
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
