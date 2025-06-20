/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { POST } from '../app/api/etf/mbti/route';

// jest.mock('next-auth', () => require('__mocks__/next-auth')); 와 같이 동작하며, 생략 가능
jest.mock('next-auth');

describe('POST /api/etf/mbti', () => {
  it('정상적으로 투자 성향과 카테고리를 등록한다', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '5' } });

    const requestObj = {
      json: async () => ({
        investType: 'MODERATE',
        preferredCategories: [
          '주식-업종섹터-금융',
          '주식-업종섹터-중공업',
          '혼합자산-주식+채권',
        ],
      }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('투자 성향 및 선호 카테고리 업데이트 성공');
  });

  it('세션이 없으면 401을 반환한다', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const requestObj = {
      json: async () => ({
        investType: 'MODERATE',
        preferredCategories: ['주식-업종섹터-금융'],
      }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe('인증된 사용자만 접근 가능합니다.');
  });

  it('유효하지 않은 investType이면 400을 반환한다', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '5' } });

    const requestObj = {
      json: async () => ({
        investType: 'INVALID_TYPE',
        preferredCategories: ['주식-업종섹터-금융'],
      }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('유효하지 않은 투자 성향입니다.');
  });

  it('preferredCategories가 배열이 아니면 400을 반환한다', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '5' } });

    const requestObj = {
      json: async () => ({
        investType: 'MODERATE',
        preferredCategories: '잘못된값' as any,
      }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('선호 카테고리는 배열이어야 합니다.');
  });

  it('preferredCategories가 빈 배열이면 400을 반환한다', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '5' } });

    const requestObj = {
      json: async () => ({
        investType: 'MODERATE',
        preferredCategories: [],
      }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('최소 하나의 선호 카테고리를 선택해주세요.');
  });

  it('유효하지 않은 카테고리가 있으면 400을 반환한다', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '5' } });

    const requestObj = {
      json: async () => ({
        investType: 'MODERATE',
        preferredCategories: ['존재하지않는카테고리'],
      }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/유효하지 않은 카테고리/);
  });
});
