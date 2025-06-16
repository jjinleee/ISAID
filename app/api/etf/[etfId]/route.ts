import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { etfId: string } }
) {
  // etfId comes from the dynamic route segment: /api/etf/[etfId]
  const etfId = Number(params.etfId);
  if (Number.isNaN(etfId)) {
    return NextResponse.json({ message: 'Invalid etfId' }, { status: 400 });
  }

  try {
    // ── 오늘 데이터 ─────────────────────────────────────
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
    
    // ── 오늘보다 과거 중 가장 최근 1건 ───────────────────
    const yesterday = await prisma.etfDailyTrading.findFirst({
      where: {
        etfId,
        baseDate: { lt: today.baseDate },   // 오늘보다 이전
      },
      orderBy: { baseDate: 'desc' },        // 가장 가까운 과거
      select: { baseDate: true, tddClosePrice: true, nav: true, objStkprcIdx: true },
    });
    
    let changeAbs: number | null = null;
    let changePct: number | null = null;
    
    if (yesterday?.tddClosePrice) {
      const prev = Number(yesterday.tddClosePrice);
      const curr = Number(today.tddClosePrice);
      changeAbs = curr - prev;
      changePct = prev !== 0 ? (changeAbs / prev) * 100 : null;
    }
    
    const sanitizedTrading = [
      {
        date: today.baseDate.toISOString().split('T')[0],
        category: today.etf?.category?.fullPath ?? null,
        issueName: today.issueName,
        issueCode: today.issueCode,
        todayClose: today.tddClosePrice ? Number(today.tddClosePrice) : null,
        prevClose: yesterday?.tddClosePrice
          ? Number(yesterday.tddClosePrice)
          : null,
        change: changeAbs,
        changePct: changePct,
        tradeVolume:
          today.accTradeVolume !== null ? Number(today.accTradeVolume) : null,
      },
    ];

    // iNAV 계산-1
    let iNav: number | null = null;
    // if (pdfData.length) {
    //   const sumShares = pdfData.reduce((acc, cur) => {
    //     const v = cur.compstIssueCu1Shares
    //       ? Number(cur.compstIssueCu1Shares)
    //       : 0;
    //     return acc + v;
    //   }, 0);
    //
    //   const sumValue = pdfData.reduce((acc, cur) => {
    //     const v = cur.valueAmount !== null ? Number(cur.valueAmount) : 0;
    //     return acc + v;
    //   }, 0);
    //
    //   if (sumValue !== 0) {
    //     iNav = sumValue / sumShares;
    //   }
    // }
    
    // iNAV 계산-2
    // let iNav: number | null = null;
    //
    // if (pdfData.length && sanitizedTrading[0].tradeVolume) {
    //   const sumValue = pdfData.reduce((acc, cur) => {
    //     const v = cur.valueAmount !== null ? Number(cur.valueAmount) : 0;
    //     return acc + v;
    //   }, 0);
    //
    //   const volume = sanitizedTrading[0].tradeVolume; // 오늘 거래량
    //
    //   if (volume !== 0) {
    //     iNav = sumValue / volume;
    //   }
    // }
    
    // iNav 계산 지수 연동식
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
