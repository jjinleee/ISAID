import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // 1. 세션 인증 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }

    const userId = BigInt(session.user.id);

    // 2. ISA 계좌와 ETF 보유 내역 조회
    const isaAccount = await prisma.iSAAccount.findUnique({
      where: { userId },
      include: {
        etfHoldings: {
          include: {
            etf: true, // etf.issueName 가져오기
          },
        },
      },
    });

    if (!isaAccount) {
      return NextResponse.json(
        { message: 'ISA 계좌 정보가 없습니다.' },
        { status: 404 }
      );
    }

    const etfHoldings = isaAccount.etfHoldings;

    // 총 매입 금액
    const totalPurchaseAmount = etfHoldings.reduce((sum, holding) => {
      return sum + Number(holding.quantity) * Number(holding.avgCost);
    }, 0);

    const enrichedHoldings = await Promise.all(
      etfHoldings.map(async (holding) => {
        // 현재가
        const latestPrice = await prisma.etfDailyTrading.findFirst({
          where: { etfId: holding.etfId },
          orderBy: { baseDate: 'desc' },
          select: { tddClosePrice: true },
        });

        const quantity = Number(holding.quantity);
        const avgCost = Number(holding.avgCost);
        const currentPrice = Number(latestPrice?.tddClosePrice ?? 0);
        const totalPurchase = quantity * avgCost;
        const returnRate =
          avgCost === 0 ? 0 : (currentPrice - avgCost) / avgCost;
        const portionOfTotal =
          totalPurchaseAmount === 0 ? 0 : totalPurchase / totalPurchaseAmount;

        return {
          etfId: holding.etfId.toString(),
          name: holding.etf.issueName,
          quantity, // 보유 수량
          avgCost, // 구매 평균 단가
          totalPurchase, // 총 매입 금액
          currentPrice, // 현재가
          returnRate, // 수익률
          portionOfTotal, // 총 투자 금액 중 비율
        };
      })
    );

    return NextResponse.json({
      data: enrichedHoldings,
    });
  } catch (err) {
    console.error('GET /api/etf/portfolio error:', err);
    return NextResponse.json({ message: 'DB Error' }, { status: 500 });
  }
}
