import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { etfId: string } }
) {
  const etfId = Number(params.etfId);
  if (Number.isNaN(etfId)) {
    return NextResponse.json({ message: 'Invalid etfId' }, { status: 400 });
  }

  try {
    // 오늘 데이터
    const today = await prisma.etfDailyTrading.findFirst({
      where: { etfId },
      orderBy: { baseDate: 'desc' },
      select: {
        baseDate: true,
        tddClosePrice: true,
        issueCode: true,
        issueName: true,
        flucRate: true,
        accTradeVolume: true,
        nav: true,
        objStkprcIdx: true,
        etf: { select: { category: { select: { fullPath: true } } } },
      },
    });
    
    if (!today) {
      return NextResponse.json(
        { message: 'No trading data for this etfId' },
        { status: 404 },
      );
    }
    
    const yesterday = await prisma.etfDailyTrading.findFirst({
      where: {
        etfId,
        baseDate: { lt: today.baseDate },   // 오늘보다 이전
      },
      orderBy: { baseDate: 'desc' },        // 가장 가까운 과거
      select: { baseDate: true, tddClosePrice: true, nav: true, objStkprcIdx: true },
    });
    
    const sanitizedTrading = [
      {
        date: today.baseDate.toISOString().split('T')[0],
        category: today.etf?.category?.fullPath ?? null,
        issueName: today.issueName,
        issueCode: today.issueCode,
        flucRate: today.flucRate,
        todayClose: today.tddClosePrice ? Number(today.tddClosePrice) : null,
        prevClose: yesterday?.tddClosePrice
          ? Number(yesterday.tddClosePrice)
          : null,
        tradeVolume:
          today.accTradeVolume !== null ? Number(today.accTradeVolume) : null,
      },
    ];

    // iNAV 계산
    let iNav: number | null = null;
    
    if (
      yesterday?.nav !== null &&
      yesterday?.objStkprcIdx !== null &&
      today?.objStkprcIdx !== null
    ) {
      const navPrev = Number(yesterday.nav);
      const idxPrev = Number(yesterday.objStkprcIdx);
      const idxCurr = Number(today.objStkprcIdx);
      
      if (idxPrev !== 0) {
        iNav = (navPrev * idxCurr) / idxPrev;
      }
    }

    return NextResponse.json({
      trading: sanitizedTrading,
      iNav,
    });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'DB Error' }, { status: 500 });
  }
}
