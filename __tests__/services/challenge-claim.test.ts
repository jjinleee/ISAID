import { createChallengePrismaMock } from '@/__mocks__/prisma-factory';
import { claimChallengeReward } from '@/services/challenge/challenge-claim';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('Challenge Claim Service', () => {
  let mockTx: any;
  const userId = BigInt(1);
  const challengeId = BigInt(1);
  const etfId = BigInt(1);
  const isaAccountId = BigInt(1);
  const today = dayjs().tz('Asia/Seoul').startOf('day');

  beforeEach(() => {
    mockTx = createChallengePrismaMock();
  });

  it('ONCE 타입 챌린지 보상을 정상적으로 수령한다', async () => {
    // Arrange
    const mockChallenge = {
      id: challengeId,
      etfId,
      quantity: new Prisma.Decimal(10),
      challengeType: 'ONCE',
      etf: { id: etfId, issueName: 'Test ETF' },
    };

    const mockUser = {
      id: userId,
      isaAccount: { id: isaAccountId },
    };

    const mockLatestTrading = {
      tddClosePrice: new Prisma.Decimal(1000),
    };

    const mockTransaction = {
      id: BigInt(1),
      isaAccountId,
      etfId,
      quantity: new Prisma.Decimal(10),
      transactionType: 'CHALLENGE_REWARD',
      price: new Prisma.Decimal(1000),
    };

    mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);
    mockTx.user.findUnique.mockResolvedValue(mockUser);
    mockTx.etfDailyTrading.findFirst.mockResolvedValue(mockLatestTrading);
    mockTx.userChallengeClaim.create.mockResolvedValue({});
    mockTx.userChallengeProgress.updateMany.mockResolvedValue({});
    mockTx.eTFTransaction.create.mockResolvedValue(mockTransaction);
    mockTx.eTFHolding.findUnique.mockResolvedValue(null);
    mockTx.eTFHolding.upsert.mockResolvedValue({});

    // Act
    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe('Reward claimed successfully');
    expect(result.transactionId).toBe(BigInt(1));

    expect(mockTx.userChallengeClaim.create).toHaveBeenCalledWith({
      data: {
        userId,
        challengeId,
        claimDate: expect.any(Date),
      },
    });

    expect(mockTx.eTFTransaction.create).toHaveBeenCalledWith({
      data: {
        isaAccountId,
        etfId,
        quantity: new Prisma.Decimal(10),
        transactionType: 'CHALLENGE_REWARD',
        price: new Prisma.Decimal(1000),
        transactionAt: expect.any(Date),
      },
    });

    // ONCE 타입은 진행도 초기화하지 않음
    expect(mockTx.userChallengeProgress.updateMany).not.toHaveBeenCalled();
  });

  it('DAILY 타입 챌린지 보상을 정상적으로 수령하고 진행도를 초기화한다', async () => {
    // Arrange
    const mockChallenge = {
      id: challengeId,
      etfId,
      quantity: new Prisma.Decimal(5),
      challengeType: 'DAILY',
      etf: { id: etfId, issueName: 'Test ETF' },
    };

    const mockUser = {
      id: userId,
      isaAccount: { id: isaAccountId },
    };

    const mockLatestTrading = {
      tddClosePrice: new Prisma.Decimal(2000),
    };

    const mockTransaction = {
      id: BigInt(2),
      isaAccountId,
      etfId,
      quantity: new Prisma.Decimal(5),
      transactionType: 'CHALLENGE_REWARD',
      price: new Prisma.Decimal(2000),
    };

    mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);
    mockTx.user.findUnique.mockResolvedValue(mockUser);
    mockTx.etfDailyTrading.findFirst.mockResolvedValue(mockLatestTrading);
    mockTx.userChallengeClaim.create.mockResolvedValue({});
    mockTx.userChallengeProgress.updateMany.mockResolvedValue({});
    mockTx.eTFTransaction.create.mockResolvedValue(mockTransaction);
    mockTx.eTFHolding.findUnique.mockResolvedValue(null);
    mockTx.eTFHolding.upsert.mockResolvedValue({});

    // Act
    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe('Reward claimed successfully');
    expect(result.transactionId).toBe(BigInt(2));

    // DAILY 타입은 진행도 초기화
    expect(mockTx.userChallengeProgress.updateMany).toHaveBeenCalledWith({
      where: { userId, challengeId },
      data: { progressVal: 0 },
    });
  });

  it('챌린지를 찾을 수 없으면 에러를 반환한다', async () => {
    mockTx.challenge.findUnique.mockResolvedValue(null);

    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Challenge not found');
  });

  it('ISA 계좌를 찾을 수 없으면 에러를 반환한다', async () => {
    const mockChallenge = {
      id: challengeId,
      etfId,
      quantity: new Prisma.Decimal(10),
      challengeType: 'ONCE',
      etf: { id: etfId, issueName: 'Test ETF' },
    };

    const mockUser = {
      id: userId,
      isaAccount: null,
    };

    mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);
    mockTx.user.findUnique.mockResolvedValue(mockUser);

    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    expect(result.success).toBe(false);
    expect(result.message).toBe('ISA account not found');
  });

  it('최신 ETF 가격을 찾을 수 없으면 에러를 반환한다', async () => {
    const mockChallenge = {
      id: challengeId,
      etfId,
      quantity: new Prisma.Decimal(10),
      challengeType: 'ONCE',
      etf: { id: etfId, issueName: 'Test ETF' },
    };

    const mockUser = {
      id: userId,
      isaAccount: { id: isaAccountId },
    };

    mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);
    mockTx.user.findUnique.mockResolvedValue(mockUser);
    mockTx.etfDailyTrading.findFirst.mockResolvedValue(null);

    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Latest ETF price not found');
  });

  it('기존 ETF 보유 내역이 있는 경우 올바르게 처리한다', async () => {
    // Arrange
    const mockChallenge = {
      id: challengeId,
      etfId,
      quantity: new Prisma.Decimal(5),
      challengeType: 'DAILY',
      etf: { id: etfId, issueName: 'Test ETF' },
    };

    const mockUser = {
      id: userId,
      isaAccount: { id: isaAccountId },
    };

    const mockLatestTrading = {
      tddClosePrice: new Prisma.Decimal(2000),
    };

    const mockExistingHolding = {
      quantity: new Prisma.Decimal(10),
      avgCost: new Prisma.Decimal(1500),
    };

    const mockTransaction = {
      id: BigInt(2),
      isaAccountId,
      etfId,
      quantity: new Prisma.Decimal(5),
      transactionType: 'CHALLENGE_REWARD',
      price: new Prisma.Decimal(2000),
    };

    mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);
    mockTx.user.findUnique.mockResolvedValue(mockUser);
    mockTx.etfDailyTrading.findFirst.mockResolvedValue(mockLatestTrading);
    mockTx.userChallengeClaim.create.mockResolvedValue({});
    mockTx.userChallengeProgress.updateMany.mockResolvedValue({});
    mockTx.eTFTransaction.create.mockResolvedValue(mockTransaction);
    mockTx.eTFHolding.findUnique.mockResolvedValue(mockExistingHolding);
    mockTx.eTFHolding.upsert.mockResolvedValue({});

    // Act
    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    // Assert
    expect(result.success).toBe(true);
    expect(mockTx.userChallengeProgress.updateMany).toHaveBeenCalledWith({
      where: { userId, challengeId },
      data: { progressVal: 0 },
    });

    // 평균 단가 계산 검증: (10 * 1500 + 5 * 2000) / 15 = 1666.67
    const expectedAvgCost = new Prisma.Decimal(15000)
      .add(new Prisma.Decimal(10000))
      .div(new Prisma.Decimal(15));

    expect(mockTx.eTFHolding.upsert).toHaveBeenCalledWith({
      where: {
        isaAccountId_etfId: {
          isaAccountId,
          etfId,
        },
      },
      update: {
        quantity: { increment: new Prisma.Decimal(5) },
        avgCost: expectedAvgCost,
        updatedAt: expect.any(Date),
      },
      create: {
        isaAccountId,
        etfId,
        quantity: new Prisma.Decimal(5),
        avgCost: expectedAvgCost,
        acquiredAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });

  it('수량과 가격이 소수일 경우 평균 단가를 올바르게 계산한다', async () => {
    const mockChallenge = {
      id: challengeId,
      etfId,
      quantity: new Prisma.Decimal('2.5'),
      challengeType: 'DAILY',
      etf: { id: etfId, issueName: 'Test ETF' },
    };

    const mockUser = {
      id: userId,
      isaAccount: { id: isaAccountId },
    };

    const mockLatestTrading = {
      tddClosePrice: new Prisma.Decimal('1500.75'),
    };

    const mockExistingHolding = {
      quantity: new Prisma.Decimal('3.5'),
      avgCost: new Prisma.Decimal('1400.25'),
    };

    const mockTransaction = {
      id: BigInt(4),
      isaAccountId,
      etfId,
      quantity: new Prisma.Decimal('2.5'),
      transactionType: 'CHALLENGE_REWARD',
      price: new Prisma.Decimal('1500.75'),
    };

    mockTx.challenge.findUnique.mockResolvedValue(mockChallenge);
    mockTx.user.findUnique.mockResolvedValue(mockUser);
    mockTx.etfDailyTrading.findFirst.mockResolvedValue(mockLatestTrading);
    mockTx.userChallengeClaim.create.mockResolvedValue({});
    mockTx.userChallengeProgress.updateMany.mockResolvedValue({});
    mockTx.eTFTransaction.create.mockResolvedValue(mockTransaction);
    mockTx.eTFHolding.findUnique.mockResolvedValue(mockExistingHolding);
    mockTx.eTFHolding.upsert.mockResolvedValue({});

    const result = await claimChallengeReward({ challengeId, userId }, mockTx);

    expect(result.success).toBe(true);
    expect(result.transactionId).toBe(BigInt(4));

    // 평균 단가 검증
    const totalQty = mockExistingHolding.quantity.add(mockChallenge.quantity); // 3.5 + 2.5 = 6.0
    const totalCost = mockExistingHolding.avgCost
      .mul(mockExistingHolding.quantity) // 1400.25 * 3.5
      .add(mockChallenge.quantity.mul(mockLatestTrading.tddClosePrice)); // 2.5 * 1500.75
    const expectedAvgCost = totalCost.div(totalQty); // (4900.875 + 3751.875) / 6.0 = 8652.75 / 6.0

    expect(mockTx.eTFHolding.upsert).toHaveBeenCalledWith({
      where: {
        isaAccountId_etfId: {
          isaAccountId,
          etfId,
        },
      },
      update: {
        quantity: { increment: new Prisma.Decimal('2.5') },
        avgCost: expectedAvgCost,
        updatedAt: expect.any(Date),
      },
      create: {
        isaAccountId,
        etfId,
        quantity: new Prisma.Decimal('2.5'),
        avgCost: expectedAvgCost,
        acquiredAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
