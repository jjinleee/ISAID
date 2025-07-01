// src/lib/data/general-transactions.ts
import { prisma } from '@/lib/prisma';

export async function seedGeneralTransactions(isaAccountId: bigint) {
  await prisma.generalTransaction.createMany({
    data: [
      // 2025-01
      {
        productId: 1,
        isaAccountId,
        transactionType: 'BUY',
        price: 1000000,
        transactionAt: new Date('2025-01-03T14:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'BUY',
        price: 550000,
        transactionAt: new Date('2025-01-07T14:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'BUY',
        price: 200000,
        transactionAt: new Date('2025-01-11T14:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'BUY',
        price: 450000,
        transactionAt: new Date('2025-01-23T14:30:00'),
      },
      // 2025-02 interest
      {
        productId: 1,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 3500,
        transactionAt: new Date('2025-02-03T14:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1500,
        transactionAt: new Date('2025-02-07T14:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-02-11T14:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 4000,
        transactionAt: new Date('2025-02-23T14:30:00'),
      },
      // 2025-02 BUY
      {
        productId: 5,
        isaAccountId,
        transactionType: 'BUY',
        price: 300000,
        transactionAt: new Date('2025-02-06T11:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'BUY',
        price: 100000,
        transactionAt: new Date('2025-02-15T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'BUY',
        price: 100000,
        transactionAt: new Date('2025-02-27T13:30:00'),
      },
      // 2025-03 dividend / interest
      {
        productId: 5,
        isaAccountId,
        transactionType: 'DIVIDEND',
        price: 3000,
        transactionAt: new Date('2025-03-06T11:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-03-15T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-03-27T13:30:00'),
      },
      // 2025-03 BUY & SELL
      {
        productId: 5,
        isaAccountId,
        transactionType: 'BUY',
        price: 300000,
        transactionAt: new Date('2025-03-07T11:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 100000,
        transactionAt: new Date('2025-03-18T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 100000,
        transactionAt: new Date('2025-03-20T13:30:00'),
      },
      {
        productId: 5,
        isaAccountId,
        transactionType: 'DIVIDEND',
        price: 1000,
        transactionAt: new Date('2025-04-07T11:30:00'),
      },
      // 2025-04 BUY & interest
      {
        productId: 2,
        isaAccountId,
        transactionType: 'BUY',
        price: 100000,
        transactionAt: new Date('2025-04-03T11:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'BUY',
        price: 200000,
        transactionAt: new Date('2025-04-10T15:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'BUY',
        price: 100000,
        transactionAt: new Date('2025-04-25T13:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-05-03T11:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-05-10T15:30:00'),
      },
      {
        productId: 4,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-05-25T13:30:00'),
      },
      // 2025-05 SELL
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 300000,
        transactionAt: new Date('2025-05-12T11:30:00'),
      },
      {
        productId: 5,
        isaAccountId,
        transactionType: 'SELL',
        price: 100000,
        transactionAt: new Date('2025-05-13T15:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'SELL',
        price: 100000,
        transactionAt: new Date('2025-05-29T13:30:00'),
      },
      // 2025-06 BUY/SELL & interest
      {
        productId: 3,
        isaAccountId,
        transactionType: 'BUY',
        price: 100000,
        transactionAt: new Date('2025-06-09T11:30:00'),
      },
      {
        productId: 2,
        isaAccountId,
        transactionType: 'SELL',
        price: 200000,
        transactionAt: new Date('2025-06-12T15:30:00'),
      },
      {
        productId: 1,
        isaAccountId,
        transactionType: 'SELL',
        price: 200000,
        transactionAt: new Date('2025-06-27T13:30:00'),
      },
      {
        productId: 3,
        isaAccountId,
        transactionType: 'INTEREST',
        price: 1000,
        transactionAt: new Date('2025-07-09T11:30:00'),
      },
    ],
    skipDuplicates: true,
  });
}
