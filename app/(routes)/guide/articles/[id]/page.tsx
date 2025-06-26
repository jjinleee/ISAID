import { notFound } from 'next/navigation';
import { articleDetails } from '../../data/article-data';
import { articles } from '../../data/category-data';
import ArticlePageContainer from './_components/article-page-container';

type Params = Promise<{ id: string | string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { id: raw } = await params;
  const idStr = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(idStr);

  const articleMeta = Object.values(articles)
    .flat()
    .find((item) => item.id === id);
  const articleDetail = articleDetails[id];

  if (!articleMeta || !articleDetail) {
    notFound();
  }

  const article = { ...articleMeta, ...articleDetail };

  const categoryList =
    Object.values(articles).find((list) =>
      list.some((a) => a.id === article.id)
    ) || [];

  const idx = categoryList.findIndex((a) => a.id === article.id);
  const related = [categoryList[idx - 1], categoryList[idx + 1]].filter(
    Boolean
  );

  const relatedArticles = related.map(({ id, title, image, views }) => ({
    id,
    title,
    image,
    views,
  }));

  return (
    <ArticlePageContainer article={article} relatedArticles={relatedArticles} />
  );
}
