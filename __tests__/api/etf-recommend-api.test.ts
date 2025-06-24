/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/etf/recommend/route';

jest.mock('next-auth');

describe('실제 DB - GET /api/etf/recommend', () => {
  it('실제 데이터를 확인한다', async () => {
    // 실제 로그인된 유저 세션 ID로 설정 (테스트용)
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: '5' }, // 실제 DB에 있는 유저 ID로 대체해야 함
    });

    const req = new NextRequest('http://localhost:3000/api/etf/recommend');
    const res = await GET(req);
    const json = await res.json();

    console.dir(json, { depth: null }); // 콘솔에서 전체 구조 확인

    expect(res.status).toBe(200);
    // expect(Array.isArray(json.data)).toBe(true);
  });
});
