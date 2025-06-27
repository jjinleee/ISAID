import { articleDetails } from '../../data/article-data';
import { articles } from '../../data/category-data';
import ArticlePageContainer from './_components/article-page-container';

export default function Page({ params }: { params: any }) {
  const id = params.id;
  const articleMeta = Object.values(articles)
    .flat()
    .find((item) => item.id === Number(id));
  const articleDetail = articleDetails[Number(id)];

  if (!articleMeta || !articleDetail) return null;

  const article = { ...articleMeta, ...articleDetail };

  const categoryList =
    Object.values(articles).find((list) =>
      list.some((a) => a.id === article.id)
    ) || [];
  const idx = categoryList.findIndex((a) => a.id === article.id);
  const related = [categoryList[idx - 1], categoryList[idx + 1]].filter(
    Boolean
  );

  // 필요한 최소 정보만 전달x
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
