'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';
import { BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Article } from '../../../data/category-data';

interface Props {
  categoryName: string;
  articles: Article[];
}

export default function CategoryNameContainer({
  categoryName,
  articles,
}: Props) {
  const router = useRouter();
  const { setHeader } = useHeader();
  useEffect(() => {
    setHeader('카테고리별 가이드', categoryName);
  }, []);

  return (
    <div className='p-4 space-y-4'>
      <h1 className='text-xl font-bold'>{categoryName}</h1>
      {articles.map((article) => (
        <Card
          key={article.id}
          className='hover:shadow-md transition-shadow cursor-pointer'
          onClick={() => router.push('/guide/articles/' + article.id)}
        >
          <CardContent>
            <div className='flex gap-4'>
              <div className='h-26 rounded-lg overflow-hidden flex-shrink-0'>
                <img
                  src={article.image || '/images/star-boy-finger.svg'}
                  alt={article.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between mb-2'>
                  <h3 className='font-semibold text-gray-900 line-clamp-1'>
                    {article.title}
                  </h3>
                  <div className={getDifficultyColor(article.difficulty)}>
                    {article.difficulty}
                  </div>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2 mb-3'>
                  {article.summary}
                </p>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 text-xs text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-3 w-3' />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  <Button size='sm' variant='ghost'>
                    <BookOpen className='h-4 w-4 mr-1' />
                    읽기
                  </Button>
                </div>

                <div className='flex flex-wrap gap-1 mt-2'>
                  {article.tags.map((tag, index) => (
                    <div
                      key={index}
                      className='text-xs font-semibold px-3 py-1 rounded-2xl border border-gray-2'
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  const commonStyle = 'rounded-2xl px-4 py-1';
  switch (difficulty) {
    case '초급':
      return `bg-green-100 text-green-800 ${commonStyle}`;
    case '중급':
      return `bg-yellow-100 text-yellow-800 ${commonStyle}`;
    case '고급':
      return `bg-red-100 text-red-800 ${commonStyle}`;
    default:
      return `bg-gray-100 text-gray-800 ${commonStyle}`;
  }
}
