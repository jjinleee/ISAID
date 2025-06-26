import { notFound } from 'next/navigation';
import { articles } from '../../data/category-data';
import CategoryNameContainer from './_components/category-name-container';

type ArticleCategory = '투자 기초' | '절세 전략' | '상품 비교';

type Params = Promise<{ 'category-name': string | string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { 'category-name': raw } = await params;
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
