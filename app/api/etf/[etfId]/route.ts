import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const etfId = Number(pathnameParts[pathnameParts.length - 1]);

    if (Number.isNaN(etfId)) {
      return NextResponse.json({ message: 'Invalid etfId' }, { status: 400 });
    }

    // EtfIntro
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
        { status: 404 }
      );
    }

    const yesterday = await prisma.etfDailyTrading.findFirst({
      where: { etfId, baseDate: { lt: today.baseDate } }, // 오늘보다 이전
      orderBy: { baseDate: 'desc' }, // 가장 가까운 과거
      select: {
        baseDate: true,
        tddClosePrice: true,
        nav: true,
        objStkprcIdx: true,
      },
    });

    let iNav: number | null = null;

    if (
      yesterday &&
      yesterday.nav !== null &&
      yesterday.objStkprcIdx !== null &&
      today?.objStkprcIdx !== null
    ) {
      const navPrev = Number(yesterday.nav);
      const idxPrev = Number(yesterday.objStkprcIdx);
      const idxCurr = Number(today.objStkprcIdx);

      if (idxPrev !== 0) {
        iNav = (navPrev * idxCurr) / idxPrev;
      }
    }

    const EtfIntro = {
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
      iNav,
    };

    // EtfDetail
    const etf = await prisma.etf.findUnique({
      where: { id: etfId },
      select: {
        comAbbrv: true,
        listDate: true,
        etfObjIndexName: true,
        taxType: true,
        etfReplicationMethod: true,
        idxMarketType: true,
        idxAssetType: true,
        etfTotalFee: true,
      },
    });

    // 최신 EtfDailyTrading
    const latestTrading = await prisma.etfDailyTrading.findFirst({
      where: { etfId },
      orderBy: { baseDate: 'desc' },
      select: {
        marketCap: true,
        nav: true,
        listShrs: true,
      },
    });

    const EtfDetail = {
      ...etf,
      marketCap: latestTrading?.marketCap
        ? Number(latestTrading.marketCap)
        : null,
      nav: latestTrading?.nav ?? null,
      listShrs: latestTrading?.listShrs ? Number(latestTrading.listShrs) : null,
    };

    return NextResponse.json({
      EtfIntro,
      EtfDetail,
    });
  } catch (err) {
    console.error('GET /api/etf/[etfId] error:', err);
    return NextResponse.json({ message: 'DB Error' }, { status: 500 });
  }
}
