'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { useParams, useRouter } from 'next/navigation';
import ArrowIcon from '@/public/images/arrow-icon';
import HanaIcon from '@/public/images/bank-icons/hana-icon';
import StarBoyGirl from '@/public/images/my-page/star-boy-girl.svg';
import StarBoy from '@/public/images/star-boy';
import Button from '@/components/button';
import ProgressBar from '@/components/progress-bar';
import Tab from '@/components/tab';
import DeleteSheet from './delete-sheet';

interface Props {
  session: Session;
}

export const MyPageContainer = ({ session }: Props) => {
  const router = useRouter();
  console.log('session : ', session);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [connected, setConnected] = useState(true);
  const [bankType, setBankType] = useState<string>('하나');
  const [accountName, setAccountName] = useState<string>('하나은행 ISA 계좌');
  const [accountNumber, setAccountNumber] =
    useState<string>('592-910508-29670');
  const [showFramer, setShowFramer] = useState(false);

  const tabs = ['보유 ETF', '연결 계좌'];
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${bankType} ${accountNumber.replace(/-/g, '')}`
    );
  };

  const deleteClick = () => {
    setShowFramer(true);
  };

  return (
    <div className='w-full pt-24 pb-10 px-7 flex flex-col gap-7'>
      <div className='border border-gray-2 rounded-2xl w-full flex items-center justify-center relative pt-20 px-9 pb-14'>
        <div className='w-full flex flex-col gap-4 items-center'>
          <div className='flex flex-col gap-2 items-center text-xl font-semibold '>
            <div
              className='border-2 border-primary rounded-full p-2 w-32 h-32 overflow-hidden flex items-center justify-center
            absolute top-[-22%] left-50% z-20 bg-white
            '
            >
              <StarBoy
                viewBox={'0 0 68 100'}
                className='w-full h-full object-cover'
              />
            </div>
            <span>{session.user.name} 님</span>
          </div>
          <div className='w-full flex flex-col text-sm text-gray'>
            <ProgressBar current={3} total={10} />
            <div className='flex justify-between '>
              <span>Lv2</span>
              <span>Lv3</span>
            </div>
            <div className='flex justify-between font-semibold'>
              <span>🔍 용어 탐색러</span>
              <span>📈 초보 투자 이론가</span>
            </div>
          </div>
          <h1 className='font-semibold'>ESFP : 자유로운 영혼의 연예인</h1>
          <div className='w-full flex justify-end items-center absolute bottom-4 right-3'>
            <span className='font-light text-sm'>내 정보 수정하기 </span>
            <ArrowIcon
              direction='right'
              color='#c9c9c9'
              className='w-4 h-4'
              viewBox='0 0 11 28'
            />
          </div>
        </div>
      </div>
      <div className='flex justify-between'>
        {tabs.map((tab, idx) => {
          return (
            <Tab
              key={idx}
              text={tab}
              active={selectedTab === idx}
              rounded={false}
              onClick={() => setSelectedTab(idx)}
            />
          );
        })}
      </div>
      {selectedTab === 1 && (
        <div className='w-full flex flex-col gap-5'>
          <h1 className='text-xl font-semibold'>ISA 계좌</h1>
          {connected ? (
            <div className='w-full flex flex-col gap-5'>
              <div className='border border-gray-2 rounded-2xl w-full flex flex-col gap-5 px-5 py-4'>
                <div className='flex flex-col gap-5'>
                  <div className=' flex flex-col text-sm'>
                    <div className='flex gap-2 font-semibold items-center'>
                      <HanaIcon width={24} height={24} />
                      <span>{accountName}</span>
                    </div>
                    <div className='flex gap-2 text-gray items-center pl-8'>
                      <span>{accountNumber}</span>
                      <u
                        className='cursor-pointer'
                        onClick={() => handleCopy()}
                      >
                        복사
                      </u>
                    </div>
                  </div>
                  <h1 className='text-xl font-semibold'>5,230,100 원</h1>
                </div>
                <div className='flex flex-col gap-1.5 w-full'>
                  <div className='w-full flex justify-between items-center p-1'>
                    <span className='text-subtitle'>가입 구분</span>
                    <span>중개형</span>
                  </div>
                  <div className='w-full flex justify-between items-center p-1'>
                    <span className='text-subtitle'>가입일</span>
                    <span>2024.11.20</span>
                  </div>
                  <div className='w-full flex justify-between items-center p-1'>
                    <span className='text-subtitle'>의무 가입 기간</span>
                    <div className='flex flex-col items-end gap-1'>
                      3년
                      <span className='text-subtitle text-xs'>~2027.11.20</span>
                    </div>
                  </div>
                  <div className='w-full flex justify-between items-center p-1'>
                    <span className='text-subtitle'>만기일</span>
                    <span>2030.11.20</span>
                  </div>
                  <div className='w-full flex justify-between items-center p-1'>
                    <span className='text-subtitle'>비과세 한도</span>
                    <span>200만원</span>
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
                  {session.user.name}님의 ISA 계좌를 연결해주세요!
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
        </div>
      )}
      <DeleteSheet
        visible={showFramer}
        onClose={() => setShowFramer(false)}
        // onSelect={(selected) => setBank(selected)}
      />
    </div>
  );
};
export default MyPageContainer;
