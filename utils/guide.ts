export const fetchTitle = (userName: string, investType: string) => {
  switch (investType) {
    case 'CONSERVATIVE':
      return `${userName}님, 차곡차곡 도움될 쇼츠 담았어요`;
    case 'MODERATE':
      return `${userName}님, 균형 잡힌 머니 힌트 챙겨왔어요`;
    case 'NEUTRAL':
      return `${userName}님, 밸런스 맞춘 재테크 스냅 담아뒀어요`;
    case 'ACTIVE':
      return `${userName}님, 성장 포인트 살려줄 영상 모아왔어요`;
    default:
      return `${userName}님, 과감한 한 수에 영감 줄 클립이에요`;
  }
};
