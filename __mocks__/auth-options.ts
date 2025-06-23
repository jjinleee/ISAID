export const authOptions = {
  // 테스트에 필요한 최소한의 구조만 포함
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session: jest.fn(),
    jwt: jest.fn(),
  },
};
