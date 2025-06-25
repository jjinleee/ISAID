import { checkFirstInvestTest } from '@/services/challenge/check';
import { insertUserChallengeProgress } from '@/services/challenge/progress';
import { ChallengeCodes } from '@/types/challenge';
import { InvestType, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface SaveMbtiResultParams {
  userId: bigint;
  investType: InvestType;
  preferredCategories: string[];
}

export interface MbtiValidationResult {
  isValid: boolean;
  errors: string[];
}

export class EtfTestService {
  /**
   * MBTI 결과 저장 (투자 성향 + 선호 카테고리)
   */
  async saveMbtiResult(params: SaveMbtiResultParams): Promise<void> {
    const { userId, investType, preferredCategories } = params;

    // 유효성 검사
    const validation = this.validateMbtiData(investType, preferredCategories);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // 트랜잭션으로 모든 작업을 원자적으로 처리
    await prisma.$transaction(async (tx) => {
      const existingProfile = await tx.investmentProfile.findUnique({
        where: { userId },
      });

      const isFirstTime = !existingProfile;

      if (isFirstTime) {
        await tx.investmentProfile.create({
          data: { userId, investType },
        });

        // 'FIRST_INVEST_TEST' 챌린지 조건 확인
        const isPassed = await checkFirstInvestTest(userId, tx);
        if (isPassed) {
          await insertUserChallengeProgress(
            tx,
            userId,
            ChallengeCodes.FIRST_INVEST_TEST
          );
        }
      } else {
        await tx.investmentProfile.update({
          where: { userId },
          data: { investType },
        });
      }

      // 2. fullPath로 EtfCategory ID들 조회
      const etfCategories = await this.getEtfCategoriesByPaths(
        preferredCategories,
        tx
      );

      // 유효하지 않은 fullPath 체크
      const foundPaths = etfCategories.map((categories) => categories.fullPath);
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
  }

  /**
   *  투자 성향(InvestType) 조회
   */
  async getUserInvestType(userId: bigint): Promise<InvestType | null> {
    const profile = await prisma.investmentProfile.findUnique({
      where: { userId },
      select: { investType: true },
    });

    return profile?.investType ?? null;
  }

  /**
   * 사용자의 선호 ETF 카테고리 목록 조회
   */
  async getUserPreferredCategories(
    userId: bigint
  ): Promise<{ id: bigint; fullPath: string }[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        userEtfCategories: {
          select: {
            etfCategory: {
              select: {
                id: true,
                fullPath: true,
              },
            },
          },
        },
      },
    });

    if (!user) return [];

    return user.userEtfCategories.map((uc) => uc.etfCategory);
  }

  /**
   *  전체 투자 프로필 조회 (투자 성향 + 선호 카테고리)
   */
  async getUserInvestmentProfile(userId: bigint): Promise<{
    investType: InvestType | null;
    preferredCategories: { id: bigint; fullPath: string }[];
  }> {
    const [investType, preferredCategories] = await Promise.all([
      this.getUserInvestType(userId),
      this.getUserPreferredCategories(userId),
    ]);

    return {
      investType,
      preferredCategories,
    };
  }

  /**
   * MBTI 데이터 유효성 검사
   */
  private validateMbtiData(
    investType: InvestType,
    preferredCategories: string[]
  ): MbtiValidationResult {
    const errors: string[] = [];

    // 투자 성향 유효성 검사
    const validInvestTypes = Object.values(InvestType);
    if (!validInvestTypes.includes(investType)) {
      errors.push('유효하지 않은 투자 성향입니다.');
    }

    // 선호 카테고리 유효성 검사
    if (!Array.isArray(preferredCategories)) {
      errors.push('선호 카테고리는 배열이어야 합니다.');
    } else if (preferredCategories.length === 0) {
      errors.push('최소 하나의 선호 카테고리를 선택해주세요.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * fullPath로 ETF 카테고리들 조회
   */
  private async getEtfCategoriesByPaths(
    paths: string[],
    tx: Prisma.TransactionClient
  ): Promise<{ id: bigint; fullPath: string }[]> {
    return await tx.etfCategory.findMany({
      where: {
        fullPath: {
          in: paths,
        },
      },
      select: {
        id: true,
        fullPath: true,
      },
    });
  }

  /**
   * 요청 데이터 유효성 검사 및 파싱
   */
  static validateRequestBody(body: any): {
    investType: InvestType;
    preferredCategories: string[];
  } {
    if (!body || typeof body !== 'object') {
      throw new Error('요청 본문이 유효하지 않습니다.');
    }

    const { investType, preferredCategories } = body;

    if (!investType) {
      throw new Error('투자 성향이 필요합니다.');
    }

    if (!preferredCategories) {
      throw new Error('선호 카테고리가 필요합니다.');
    }

    return {
      investType,
      preferredCategories,
    };
  }
}
