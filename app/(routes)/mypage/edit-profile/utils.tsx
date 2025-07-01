import { toast } from 'react-hot-toast';
import { CircleAlert, SquareCheckBig } from 'lucide-react';
import { updateUser } from '@/lib/api/my-page';

export const submitUserUpdate = async ({
  data,
  onSuccess,
  onFinally,
}: {
  data: Record<string, any>;
  onSuccess?: () => void;
  onFinally?: () => void;
}) => {
  const isPinUpdate = 'oldPinCode' in data && 'pinCode' in data;
  const isPasswordUpdate = 'oldPassword' in data && 'password' in data;
  const res = await updateUser(data);

  if (res.success) {
    toast.success('정보 수정이 완료되었습니다!', {
      icon: <SquareCheckBig className='w-5 h-5 text-hana-green' />,
      style: {
        borderRadius: '8px',
        color: 'black',
        fontWeight: '500',
      },
    });

    onSuccess?.();
  } else {
    toast.error(
      isPinUpdate
        ? '이전 비밀번호가 일치하지 않습니다.'
        : isPasswordUpdate
          ? '기존 비밀번호가 일치하지 않습니다.'
          : '잠시 후 다시 시도해주세요.',
      {
        duration: 2000,
        icon: <CircleAlert className='w-5 h-5 text-hana-red' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      }
    );
  }

  onFinally?.();
};
