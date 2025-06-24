import {
  SlideImg1,
  SlideImg2,
  SlideImg3,
  SlideImg4,
  SlideImg5,
} from '@/public/images/etf/etf-slide';
import { SlideCardProps } from '@/types/components';

export const cards: SlideCardProps[] = [
  {
    id: 1,
    title: '시장 대표 ETF',
    subtitle: '대표 지수에 투자하고 싶다면',
    description: '가장 기본이 되는 지수 ETF 로 시장 흐름을 따라가요',
    category: 'market-core',
    children: <SlideImg1 />,
  },
  {
    id: 2,
    title: '업종별로 골라보는 ETF',
    subtitle: '관심있는 산업에 바로 투자',
    description: '건설부터 IT까지, 다양한 산업별 테마를 모았어요',
    category: 'industry',
    children: <SlideImg2 />,
  },
  {
    id: 3,
    title: '전략형 ETF',
    subtitle: '성장? 배당? 당신의 전략은?',
    description: '가치, 성장, 배당... 투자 성향에 따라 전략을 골라보세요.',
    category: 'strategy',
    children: <SlideImg3 />,
  },
  {
    id: 4,
    title: '규모 기반 ETF',
    subtitle: '대형주? 중형주? 내가 고르는 사이즈',
    description: '안정적인 대형주부터 잠재력 있는 중형주까지.',
    category: 'market-cap',
    children: <SlideImg4 />,
  },
  {
    id: 5,
    title: '혼합 자산 ETF',
    subtitle: '주식도 채권도 놓치기 싫다면',
    description: '리스크는 낮추고 수익은 챙기는 균형형 포트폴리오',
    category: 'mixed-assets',
    children: <SlideImg5 />,
  },
];
