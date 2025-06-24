import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DeleteSheet from '@/app/(routes)/mypage/_components/delete-sheet';
import ArrowIcon from '@/public/images/arrow-icon';
import StarBoyGirl from '@/public/images/my-page/star-boy-girl.svg';
import { Account } from '@/types/my-page';
import { SquareCheckBig } from 'lucide-react';
import Button from '@/components/button';
import { deleteISA } from '@/lib/api/my-page';
import {
  addYears,
  formatComma,
  formatDate,
  formatHanaAccountNumber,
} from '@/lib/utils';

interface Props {
  connected: boolean;
  userName: string;
  account: Account;
}

export const IsaAccountSection = ({ connected, userName, account }: Props) => {
  const router = useRouter();
  const [showFramer, setShowFramer] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${account.bankCode} ${account.accountNum.replace(/-/g, '')}`
    );
    toast.success('계좌번호가 복사되었어요!');
  };

  const deleteClick = () => {
    setShowFramer(true);
  };

  const deleteAccount = async () => {
    const res = await deleteISA();
    if ('error' in res) {
      if (res.error === 'NOT_FOUND') {
        console.log('ISA 계좌가 없습니다.');
      } else {
        console.log('삭제 실패:', res.status);
      }
    } else {
      setShowFramer(false);
      console.log('삭제 성공:', res);
      toast.success('계좌 삭제가 완료되었습니다!', {
        icon: <SquareCheckBig className='w-5 h-5 text-hana-green' />,
        style: {
          borderRadius: '8px',
          color: 'black',
          fontWeight: '500',
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  const companyMap = {
    하나증권: 'hanaIcon.svg',
    미래에셋증권: 'miraeIcon.png',
    삼성증권: 'samsungIcon.png',
    NH투자증권: 'nhIcon.png',
    한국투자증권: 'koreaIcon.png',
    키움증권: 'kiwoomIcon.png',
    신한투자증권: 'sinhanIcon.png',
    KB증권: 'kbIcon.jpeg',
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      <h1 className='text-xl font-semibold'>ISA 계좌</h1>
      {connected && account ? (
        <div className='w-full flex flex-col gap-5'>
          <div className='border border-gray-2 rounded-2xl w-full flex flex-col gap-5 px-5 py-4'>
            <div className='flex flex-col gap-5'>
              <div className=' flex flex-col text-sm'>
                <div className='flex gap-2 font-semibold items-center'>
                  <Image
                    src={`/images/securities-icons/${companyMap[account.bankCode]}`}
                    alt={account.bankCode}
                    width={36}
                    height={36}
                    className='rounded-full p-0.5'
                  />
                  <span>{`${account.bankCode} ${account.accountType} 계좌`}</span>
                </div>
                <div className='flex gap-2 text-gray items-center pl-11'>
                  <span>{formatHanaAccountNumber(account.accountNum)}</span>
                  <u className='cursor-pointer' onClick={() => handleCopy()}>
                    복사
                  </u>
                </div>
              </div>
              <h1 className='text-xl font-semibold'>
                {formatComma(account.currentBalance)}원
              </h1>
            </div>
            <div className='flex flex-col gap-1.5 w-full'>
              <div className='w-full flex justify-between items-center p-1'>
                <span className='text-subtitle'>가입 구분</span>
                <span>중개형</span>
              </div>
              <div className='w-full flex justify-between items-center p-1'>
                <span className='text-subtitle'>가입일</span>
                <span>{formatDate(account.connectedAt)}</span>
              </div>
              <div className='w-full flex justify-between items-center p-1'>
                <span className='text-subtitle'>의무 가입 기간</span>
                <div className='flex flex-col items-end gap-1'>
                  3년
                  <span className='text-subtitle text-xs'>
                    ~{formatDate(addYears(account.connectedAt, 3))}
                  </span>
                </div>
              </div>
              <div className='w-full flex justify-between items-center p-1'>
                <span className='text-subtitle'>만기일</span>
                <span>{formatDate(addYears(account.connectedAt, 3))}</span>
              </div>
              <div className='w-full flex justify-between items-center p-1'>
                <span className='text-subtitle'>비과세 한도</span>
                <span>
                  {account.accountType === '서민형' ? '400만 원' : '200만 원'}
                </span>
              </div>
            </div>
          </div>
          <div
            className='w-full flex justify-end items-center text-hana-red font-medium text-sm cursor-pointer'
            onClick={() => deleteClick()}
          >
            <span>내 계좌 삭제하기 </span>
            <ArrowIcon
              direction='right'
              color='#dc221e'
              className='w-4 h-4'
              viewBox='0 0 11 28'
            />
          </div>
        </div>
      ) : (
        <div className='w-full flex flex-col gap-5'>
          <div className='border border-gray-2 rounded-2xl w-full flex flex-col gap-5 px-5 pt-4 pb-9 items-center'>
            <h1 className='font-semibold self-start'>
              {userName}님의 ISA 계좌를 연결해주세요!
            </h1>
            <StarBoyGirl />
          </div>
          <Button
            text={'연결하기'}
            thin={false}
            active={true}
            onClick={() => router.push('mypage/account-connect')}
          />
        </div>
      )}
      <DeleteSheet
        visible={showFramer}
        onClose={() => setShowFramer(false)}
        deleteAccount={deleteAccount}
      />
    </div>
  );
};
export default IsaAccountSection;
