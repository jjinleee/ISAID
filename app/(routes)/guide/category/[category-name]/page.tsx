import { notFound } from 'next/navigation';
import { articles } from '../../data/category-data';
import CategoryNameContainer from './_components/category-name-container';

type ArticleCategory = '투자 기초' | '절세 전략' | '상품 비교';

export default function Page({ params }: { params: any }) {
  const raw = (params as { 'category-name': string | string[] })[
    'category-name'
  ];
  const categoryName = Array.isArray(raw) ? raw[0] : raw;
  const decoded = decodeURIComponent(categoryName) as ArticleCategory;

  if (!['투자 기초', '절세 전략', '상품 비교'].includes(decoded)) {
    notFound();
  }

  const articleList = articles[decoded];

  return (
    <CategoryNameContainer categoryName={decoded} articles={articleList} />
  );
}
