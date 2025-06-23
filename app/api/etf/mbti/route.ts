import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { EtfTestService } from '@/services/etf/etf-test-service';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest) {
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

    // 2. 요청 데이터 파싱 및 유효성 검사
    const body = await req.json();
    const { investType, preferredCategories } =
      EtfTestService.validateRequestBody(body);

    // 3. 서비스 로직 실행
    const etfMbtiService = new EtfTestService();
    await etfMbtiService.saveMbtiResult({
      userId,
      investType,
      preferredCategories,
    });

    return NextResponse.json({
      message: '투자 성향 및 선호 카테고리 업데이트 성공',
    });
  } catch (error) {
    console.error('MBTI API 오류:', error);

    if (error instanceof Error) {
      // 비즈니스 로직 에러
      if (
        error.message.includes('유효하지 않은') ||
        error.message.includes('필요합니다') ||
        error.message.includes('선택해주세요')
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

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

    // 2. 서비스 로직 실행
    const etfMbtiService = new EtfTestService();
    const profile = await etfMbtiService.getUserInvestmentProfile(userId);

    if (!profile.investType && profile.preferredCategories.length === 0) {
      return NextResponse.json(
        { message: '투자 프로필이 없습니다.' },
        { status: 404 }
      );
    }

    // 3. BigInt 변환 Number(category.id) or category.id.toString()
    // const serializedProfile = {
    //   investType: profile.investType,
    //   preferredCategories: profile.preferredCategories.map((category) => ({
    //     id: Number(category.id),
    //     fullPath: category.fullPath,
    //   })),
    // };

    // return NextResponse.json(serializedProfile);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('MBTI GET API 오류:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
