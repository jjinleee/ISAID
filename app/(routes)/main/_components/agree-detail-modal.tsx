'use client';

import { ReasonProps } from '@/types/etf';
import { CircleAlert, X } from 'lucide-react';
import Button from '@/components/button';

export default function AgreeDetailModal({
  onClose,
  btnClick,
}: {
  onClose: () => void;
  btnClick: () => void;
}) {
  return (
    <div
      className='fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='relative bg-white rounded-2xl w-[90%] max-w-md z-10 max-h-[80vh] overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='sticky top-0 bg-white p-6 border-b border-gray-200 z-20'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
          >
            <X className='w-5 h-5' />
          </button>
          <h1 className='font-semibold text-lg'>약관 상세 내용</h1>
        </div>
        <div className='p-5 overflow-y-auto max-h-[calc(80vh-100px)] overscroll-contain scrollbar-hide'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              본인은 ISA 중개형 계좌를 본 서비스에 연결하여 챌린지 달성 시
              소수점 ETF를 리워드로 지급받기 위해, 서비스 운영사(이하 “회사”)가
              다음의 행위를 수행하는 것에 동의합니다. 회사는 회원 인증을 통해
              ISA 계좌번호, 잔액·거래·보유 종목·배당 내역 등 ISA 관련 정보를
              조회하고, 챌린지 보상 지급을 위한 최소한의 범위에서 회원을
              대신하여 소수점 ETF 매수·입고 주문을 전자적 방법으로 일임 처리할
              수 있습니다. 회사는 그 밖의 임의 매매를 절대로 실행하지 않으며,
              주문 집행은 제휴 증권사 시스템을 통해 이루어집니다. 이러한
              일임·위임은 「자본시장과 금융투자업에 관한 법률」 및
              「전자금융거래법」이 정한 범위 안에서만 행해집니다. 회사는 챌린지
              운영, 보상 산정·지급, 맞춤형 포트폴리오 분석, 법령상 의무 이행(예:
              원천징수, 금융거래 보고)을 위해 성명, CI/DI, 생년월일, ISA
              계좌번호, 챌린지 참여·달성 내역, 거래·보유 데이터 등
              개인정보·신용정보를 수집·이용하며, 필요한 범위 내에서 제휴 증권사,
              국세청 및 관계 감독기관에 제공할 수 있습니다. 정보 보유 기간은
              전자금융거래 기록 보존 의무에 따라 목적 달성 후 5년 또는 회원이
              동의를 철회할 때까지입니다. 챌린지 보상으로 지급되는 소수점 ETF는
              ISA 비과세 한도(연 2 백만 원 / 서민형 4 백만 원)를 초과할 경우 9.9
              % 분리과세 대상이 됩니다. 챌린지 달성 사실이 확정되면 영업일 기준
              T+2일 이내에 소수점 ETF가 회원 ISA 계좌로 입고되며, 부정 참여·허위
              계좌 연결 등 사유가 발견되면 지급이 취소되거나 회수될 수 있습니다.
              ETF는 기초지수 변동, 세제·환율 변동 등에 따라 원금 손실이 발생할
              수 있고, 소수점 단위는 유동성 제한으로 매도 시점에 불리할 수
              있습니다. 회사는 챌린지 보상 집행 외의 자산 운용, 수익·손실에 대해
              책임을 지지 않으며, 시스템 장애·천재지변 등에 따른 거래
              지연·취소는 「전자금융거래법」이 정한 범위에서만 배상 책임을
              집니다. 회원은 언제든지 서비스 내 ‘ISA 계좌 연결 해제’ 메뉴를 통해
              동의를 철회할 수 있으며, 철회 즉시 계좌 조회·거래 위임이 중단되고
              챌린지 참여 및 보상 지급이 제한됩니다. 본인은 상기 모든 내용을
              충분히 숙지하였으며 이에 전적으로 동의합니다.
            </div>
            <div className='flex flex-col gap-2'>
              <Button
                thin={false}
                text={'동의하기'}
                onClick={btnClick}
                active={true}
              />
              <Button
                thin={false}
                text={'닫기'}
                onClick={onClose}
                active={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
