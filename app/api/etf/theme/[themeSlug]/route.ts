import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const themeToCategoryIds: Record<string, number[]> = {
  'market-core': [1],
  industry: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  strategy: [15, 16, 17, 18, 19, 20, 21, 22],
  'market-cap': [23, 24],
  'mixed-assets': [25, 26],
};

const themeToDisplayName: Record<string, string> = {
  'market-core': '주식-시장대표',
  industry: '주식-업종섹터',
  strategy: '주식-전략',
  'market-cap': '주식-규모',
  'mixed-assets': '혼합자산',
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const themeSlug = pathnameParts[pathnameParts.length - 1];
    const ids = themeToCategoryIds[themeSlug];
    const displayName = themeToDisplayName[themeSlug];

    if (!ids) {
      return NextResponse.json({ error: 'Invalid themeSlug' }, { status: 400 });
    }

    const categories = await prisma.etfCategory.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        assetType: true,
        assetSubtype: true,
        fullPath: true,
      },
      orderBy: { id: 'asc' },
    });

    const renamed = categories.map((c) => {
      const isMixedAssets = themeSlug === 'mixed-assets';
      const rawName = isMixedAssets ? c.assetType : c.assetSubtype;

      return {
        id: c.id.toString(),
        name: rawName ?? 'etc',
        fullname: c.fullPath,
      };
    });

    // etc를 맨 뒤로 정렬
    renamed.sort((a, b) => {
      if (a.name === 'etc' && b.name !== 'etc') return 1;
      if (a.name !== 'etc' && b.name === 'etc') return -1;
      return 0;
    });

    return NextResponse.json({
      displayName,
      categories: renamed,
    });
  } catch (error) {
    console.error('GET /api/etf/theme/[themeSlug] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
