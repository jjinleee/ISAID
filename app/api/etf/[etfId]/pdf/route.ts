import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const etfId = Number(pathnameParts[pathnameParts.length - 2]);

    if (isNaN(etfId)) {
      return NextResponse.json({ error: 'Invalid etfId' }, { status: 400 });
    }

    const pdfList = await prisma.etfPdf.findMany({
      where: { etfId },
      select: {
        compstIssueName: true,
        compstIssueCu1Shares: true,
        compstRatio: true,
      },
    });

    if (!pdfList.length) {
      return NextResponse.json({ data: [], hasRecalculated: false });
    }

    const allRatioNull = pdfList.every((item) => item.compstRatio === null);

    if (allRatioNull) {
      const totalCount = pdfList.length;
      const equalRatio = Number((100 / totalCount).toFixed(2));

      const result = pdfList.map((item) => ({
        ...item,
        recalculatedRatio: equalRatio,
      }));

      return NextResponse.json({
        data: result,
        hasRecalculated: false,
      });
    }

    const totalRatio = pdfList.reduce(
      (sum, item) => sum + Number(item.compstRatio),
      0
    );

    const result = pdfList.map((item) => ({
      compstIssueName: item.compstIssueName,
      compstIssueCu1Shares: item.compstIssueCu1Shares,
      compstRatio: item.compstRatio,
      recalculatedRatio: Number(
        ((Number(item.compstRatio) / totalRatio) * 100).toFixed(2)
      ),
    }));

    return NextResponse.json({
      data: result,
      hasRecalculated: true,
    });
  } catch (error) {
    console.error('GET /api/etf/[etfId]/pdf error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
