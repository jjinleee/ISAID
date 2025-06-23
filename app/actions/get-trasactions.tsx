import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export type CalendarTx = {
  title: string;
  amount: number;
  type: '매수' | '매도' | '입금' | '출금' | '배당금' | '이자';
};

export type CalendarData = {
  transactionDates: Date[];
  transactionData: Record<string, CalendarTx[]>;
};

export const getTransactions = async (): Promise<CalendarData> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
  const userId = Number(session.user.id);

  const isaAccount = await prisma.iSAAccount.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!isaAccount) throw new Error('ISA 계좌가 없습니다.');
  const isaAccountId = isaAccount.id;

  const [generalTxs, etfTxs] = await Promise.all([
    prisma.generalTransaction.findMany({
      where: { isaAccountId },
      select: {
        id: true,
        transactionType: true,
        price: true,
        transactionAt: true,
        product: { select: { productName: true } },
      },
    }),
    prisma.eTFTransaction.findMany({
      where: { isaAccountId },
      select: {
        id: true,
        transactionType: true,
        price: true,
        quantity: true,
        transactionAt: true,
        etf: { select: { issueNameKo: true } },
      },
    }),
  ]);

  type TxCommon = {
    id: string;
    rawType: string;
    amount: number;
    at: Date;
    label: string;
  };
  const normalized: TxCommon[] = [
    ...generalTxs.map((g) => ({
      id: g.id.toString(),
      rawType: g.transactionType,
      amount: g.price?.toNumber() ?? 0,
      at: g.transactionAt,
      label: g.product.productName,
    })),
    ...etfTxs.map((e) => ({
      id: e.id.toString(),
      rawType: e.transactionType,
      amount: e.price.toNumber(),
      at: e.transactionAt,
      label: e.etf.issueNameKo ?? 'ETF',
    })),
  ];

  const typeMap: Record<string, CalendarTx['type']> = {
    BUY: '매수',
    SELL: '매도',
    DIVIDEND: '배당금',
    INTEREST: '이자',
    DEPOSIT: '입금',
    WITHDRAW: '출금',
  };

  const transactionData: Record<string, CalendarTx[]> = {};
  normalized.forEach((tx) => {
    const key = tx.at.toISOString().slice(0, 10);
    if (!transactionData[key]) transactionData[key] = [];
    transactionData[key].push({
      title: tx.label,
      amount: tx.amount,
      type: typeMap[tx.rawType] ?? '매수',
    });
  });

  const transactionDates = Object.keys(transactionData).map((dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  });

  return {
    transactionDates,
    transactionData,
  };
};
