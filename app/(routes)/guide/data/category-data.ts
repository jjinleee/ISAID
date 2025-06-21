type ArticleCategory = '투자 기초' | '절세 전략' | '상품 비교';

export interface Article {
  id: number;
  title: string;
  summary: string;
  views: string;
  difficulty: '초급' | '중급' | '고급';
  tags: string[];
  image: string;
}
const imagePath = '/images/star-boy-finger.svg';

export const articles: Record<ArticleCategory, Article[]> = {
  '투자 기초': [
    {
      id: 1,
      title: '주식이란 무엇인가요?',
      summary: '주식의 기본 개념부터 투자 방법까지 쉽게 설명드려요',
      views: '12.5K',
      difficulty: '초급',
      tags: ['주식', '기초', '투자'],
      image: imagePath,
    },
    {
      id: 2,
      title: 'ETF 완전 정복하기',
      summary: 'ETF의 모든 것! 종류부터 선택 방법까지',
      views: '9.8K',
      difficulty: '초급',
      tags: ['ETF', '펀드', '분산투자'],
      image: imagePath,
    },
    {
      id: 3,
      title: '리스크 관리의 핵심',
      summary: '투자 위험을 줄이는 실전 노하우',
      views: '7.2K',
      difficulty: '중급',
      tags: ['리스크', '포트폴리오', '분산투자'],
      image: imagePath,
    },
    {
      id: 4,
      title: '달러 코스트 애버리징이란?',
      summary: '정기적 투자로 리스크를 줄이는 방법',
      views: '5.9K',
      difficulty: '초급',
      tags: ['적립식', '투자전략', 'DCA'],
      image: imagePath,
    },
  ],
  '절세 전략': [
    {
      id: 5,
      title: 'ISA 활용법 A to Z',
      summary: 'ISA 계좌로 세금을 최대한 아끼는 방법',
      views: '15.3K',
      difficulty: '중급',
      tags: ['ISA', '절세', '세금'],
      image: imagePath,
    },
    {
      id: 6,
      title: '연금저축 vs IRP 비교',
      summary: '어떤 연금 상품이 나에게 유리할까요?',
      views: '11.7K',
      difficulty: '중급',
      tags: ['연금저축', 'IRP', '노후준비'],
      image: imagePath,
    },
    {
      id: 7,
      title: '세액공제 완벽 가이드',
      summary: '놓치기 쉬운 세액공제 항목들',
      views: '8.4K',
      difficulty: '초급',
      tags: ['세액공제', '소득공제', '절세'],
      image: imagePath,
    },
  ],
  '상품 비교': [
    {
      id: 8,
      title: 'ETF vs 펀드, 뭐가 다를까?',
      summary: '두 상품의 차이점과 장단점 비교',
      views: '13.2K',
      difficulty: '초급',
      tags: ['ETF', '펀드', '비교'],
      image: imagePath,
    },
    {
      id: 9,
      title: '적금 vs 투자, 어떤 선택?',
      summary: '안전한 적금과 투자, 나에게 맞는 것은?',
      views: '10.1K',
      difficulty: '초급',
      tags: ['적금', '투자', '자산관리'],
      image: imagePath,
    },
    {
      id: 10,
      title: '보험 상품 선택 가이드',
      summary: '꼭 필요한 보험만 골라내는 방법',
      views: '6.8K',
      difficulty: '중급',
      tags: ['보험', '보장', '리스크'],
      image: imagePath,
    },
  ],
};
