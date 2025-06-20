export const getServerSession = jest.fn(() =>
  Promise.resolve({
    user: {
      id: '5', // 테스트용 유저 ID
      email: 'test@test.com',
    },
  })
);
