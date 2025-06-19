import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const etfCategoryId = pathnameParts[pathnameParts.length - 1];

    const page = Number(url.searchParams.get('page') ?? '1');
    const size = Number(url.searchParams.get('size') ?? '20');
    const keyword = url.searchParams.get('keyword')?.trim().toLowerCase() ?? '';
    const filter = url.searchParams.get('filter') ?? 'name'; // name | code

    if (!etfCategoryId || isNaN(Number(etfCategoryId))) {
      return NextResponse.json(
        { error: 'Invalid or missing etfCategoryId' },
        { status: 400 }
      );
    }

    // 카테고리 정보 조회
    const category = await prisma.etfCategory.findUnique({
      where: { id: Number(etfCategoryId) },
      select: { fullPath: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const where = {
      etfCategoryId: Number(etfCategoryId),
      ...(keyword &&
        filter === 'name' && {
          issueName: { contains: keyword },
        }),
      ...(keyword &&
        filter === 'code' && {
          issueCode: { contains: keyword },
        }),
    };

    const [etfs, total] = await Promise.all([
      prisma.etf.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          issueCode: true,
          issueName: true,
          tradings: {
            orderBy: { baseDate: 'desc' },
            take: 1,
            select: {
              accTradeVolume: true,
              tddClosePrice: true,
              flucRate: true,
            },
          },
        },
      }),
      prisma.etf.count({ where }),
    ]);

    /*
    // etfCategoryId에 속한 ETF 목록 가져오기
    const etfs = await prisma.etf.findMany({
      where: { etfCategoryId: Number(etfCategoryId) },
      select: {
        id: true,
        issueCode: true,
        issueName: true,
        tradings: {
          orderBy: { baseDate: 'desc' },
          take: 1, // 가장 최신 거래 데이터 1건
          select: {
            accTradeVolume: true,
            tddClosePrice: true,
            flucRate: true,
          }
        }
      }
    });
    */

    // 응답 구조 가공
    const data = etfs.map((etf) => ({
      etfId: etf.id.toString(),
      issueCode: etf.issueCode,
      issueName: etf.issueName,
      accTradeVolume: etf.tradings[0]?.accTradeVolume
        ? Number(etf.tradings[0]?.accTradeVolume)
        : 0,
      tddClosePrice: etf.tradings[0]?.tddClosePrice ?? 0,
      flucRate: etf.tradings[0]?.flucRate ?? 0,
    }));

    // 카테고리 테마 보여주기 위해 fullPath 반환, - 기준으로 가장 끝 요소 추출해서 사용
    return NextResponse.json({
      data,
      total,
      etfCategoryFullPath: category.fullPath,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
