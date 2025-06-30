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
const imagePath = '/images/quiz/favicon.svg';

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
      title: 'ETF, 한 번에 이해하기',
      summary: 'ETF 입문자를 위한 기초 가이드! 종류, 장점, 투자 팁까지 한눈에',
      views: '9.8K',
      difficulty: '중급',
      tags: ['ETF', '펀드', '분산투자'],
      image: imagePath,
    },
    {
      id: 3,
      title: 'ETF 투자지표 용어 한눈에 정리하기',
      summary: 'NAV, iNAV, 괴리율… 어렵게 느껴졌다면 이 글로 정리 끝!',
      views: '7.2K',
      difficulty: '고급',
      tags: ['ETF 용어', '기초지수', '투자지표'],
      image: imagePath,
    },
    {
      id: 4,
      title: 'ETF 세금, 이것만은 꼭 알고 투자하자!',
      summary: '국내·해외 ETF 세금 차이부터 절세 방법까지!',
      views: '5.9K',
      difficulty: '중급',
      tags: ['ETF 세금', '양도소득세', '금융소득'],
      image: imagePath,
    },
  ],
  '절세 전략': [
    {
      id: 5,
      title: 'ISA 활용법 A to Z',
      summary: 'ISA 계좌가 뭔가요?',
      views: '15.3K',
      difficulty: '초급',
      tags: ['ISA', '절세', '세금'],
      image: imagePath,
    },
    {
      id: 6,
      title: '절세계좌 3종 혜택 하나씩 비교해보자면?',
      summary: '어떤 상품이 나에게 유리할까요?',
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
      difficulty: '중급',
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
      title: '적금 vs 투자, 어떤 선택을 해야할까?',
      summary: '안전한 적금과 투자, 나에게 맞는 것은?',
      views: '10.1K',
      difficulty: '초급',
      tags: ['적금', '투자', '자산관리'],
      image: imagePath,
    },
  ],
};
