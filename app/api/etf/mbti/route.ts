import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { InvestType } from '@prisma/client';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

type RequestBody = {
  investType: InvestType;
  preferredCategories: string[]; // EtfCategory.fullPath[]
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: '인증된 사용자만 접근 가능합니다.' },
        { status: 401 }
      );
    }
    const userId = BigInt(session.user.id);

    const body = await req.json();
    const { investType, preferredCategories }: RequestBody = body;

    const validInvestTypes = Object.values(InvestType);
    if (!validInvestTypes.includes(investType)) {
      return NextResponse.json(
        { error: '유효하지 않은 투자 성향입니다.' },
        { status: 400 }
      );
    }

    // preferredCategories 유효성 검사
    if (!Array.isArray(preferredCategories)) {
      return NextResponse.json(
        { error: '선호 카테고리는 배열이어야 합니다.' },
        { status: 400 }
      );
    }

    // 빈 배열에 대한 처리
    if (preferredCategories.length === 0) {
      return NextResponse.json(
        { error: '최소 하나의 선호 카테고리를 선택해주세요.' },
        { status: 400 }
      );
    }

    // 트랜잭션으로 모든 작업을 원자적으로 처리
    await prisma.$transaction(async (tx) => {
      // 1. 투자 성향 저장 (upsert)
      await tx.investmentProfile.upsert({
        where: { userId },
        update: { investType },
        create: { userId, investType },
      });

      // 2. fullPath로 EtfCategory ID들 조회
      const etfCategories = await tx.etfCategory.findMany({
        where: {
          fullPath: {
            in: preferredCategories,
          },
        },
        select: {
          id: true,
          fullPath: true,
        },
      });

      // 유효하지 않은 fullPath 체크
      const foundPaths = etfCategories.map((cat) => cat.fullPath);
      const invalidPaths = preferredCategories.filter(
        (path) => !foundPaths.includes(path)
      );

      if (invalidPaths.length > 0) {
        throw new Error(`유효하지 않은 카테고리: ${invalidPaths.join(', ')}`);
      }

      // 3. 기존 사용자 카테고리 관계 모두 삭제
      await tx.userEtfCategory.deleteMany({
        where: { userId },
      });

      // 4. 새로운 카테고리 관계 생성
      if (etfCategories.length > 0) {
        await tx.userEtfCategory.createMany({
          data: etfCategories.map((category) => ({
            userId,
            etfCategoryId: category.id,
          })),
        });
      }
    });

    return NextResponse.json({
      message: '투자 성향 및 선호 카테고리 업데이트 성공',
    });
  } catch (error) {
    console.error('오류:', error);

    if (
      error instanceof Error &&
      error.message.includes('유효하지 않은 카테고리')
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
