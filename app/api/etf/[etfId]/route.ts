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
    const rows = await prisma.etfDailyTrading.findMany({
      where: { etfId }, // 반드시 해당 ETF만
      select: {
        etfId: true, // ETF ID
        issueCode: true, // 종목코드
        issueName: true, // 한글종목명
        tddClosePrice: true, // 종가
        accTradeVolume: true, // 거래량
        flucRate: true, // 수익률(등락률)
        etf: {
          select: {
            category: {
              select: { fullPath: true }, // 전체 카테고리
            },
          },
        },
      },
    });

    const sanitizedTrading = rows.map((d) => ({
      category: d.etf?.category?.fullPath ?? null, // 전체 카테고리
      issueName: d.issueName, // 한글종목명
      issueCode: d.issueCode, // 종목코드
      closePrice: d.tddClosePrice ? Number(d.tddClosePrice) : null, // 종가
      tradeVolume: d.accTradeVolume !== null ? Number(d.accTradeVolume) : null, // 거래량
      yield: d.flucRate !== null ? Number(d.flucRate) : null, // 수익률
    }));

    let pdfData: {
      compstIssueCu1Shares: Decimal | null;
      valueAmount: bigint | null;
    }[] = [];
    if (etfId) {
      pdfData = await prisma.etfPdf.findMany({
        where: { etfId },
        select: {
          compstIssueCu1Shares: true,
          valueAmount: true,
        },
      });
    }

    // iNAV 계산
    let iNav: number | null = null;
    if (pdfData.length) {
      const sumShares = pdfData.reduce((acc, cur) => {
        const v = cur.compstIssueCu1Shares
          ? Number(cur.compstIssueCu1Shares)
          : 0;
        return acc + v;
      }, 0);

      const sumValue = pdfData.reduce((acc, cur) => {
        const v = cur.valueAmount !== null ? Number(cur.valueAmount) : 0;
        return acc + v;
      }, 0);

      if (sumValue !== 0) {
        iNav = sumValue / sumShares;
      }
    }

    const sanitizedPdf = pdfData.map((d) => ({
      compstIssueCu1Shares: d.compstIssueCu1Shares
        ? Number(d.compstIssueCu1Shares)
        : null,
      valueAmount: d.valueAmount !== null ? Number(d.valueAmount) : null,
    }));

    return NextResponse.json({
      trading: sanitizedTrading,
      pdf: sanitizedPdf,
      iNav,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'DB Error' }, { status: 500 });
  }
}
