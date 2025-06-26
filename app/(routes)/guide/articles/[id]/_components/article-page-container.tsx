'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/context/header-context';

interface ArticleMeta {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  views: string;
  likes: number;
  tags: string[];
  difficulty: '초급' | '중급' | '고급';
  content: string;
}

interface RelatedMini {
  id: number;
  title: string;
  image: string;
  views: string;
}

export default function ArticlePageContainer({
  article,
  relatedArticles = [],
}: {
  article: ArticleMeta;
  relatedArticles?: RelatedMini[];
}) {
  const { setHeader } = useHeader();
  const router = useRouter();
  const handleNavigate = (id: number) => router.push(`/guide/articles/${id}`);

  useEffect(() => {
    if (article) {
      setHeader(article.title, article.summary);
    }
  }, [article]);

  return (
    <div className='p-4 space-y-4'>
      <div>
        <div className='p-4'>
          <div className='prose prose-sm max-w-none'>
            {(() => {
              const lines = article.content.split('\n');
              const elements: React.ReactNode[] = [];

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (line.trim().startsWith('|')) {
                  const tableLines: string[] = [];
                  while (i < lines.length && lines[i].trim().startsWith('|')) {
                    tableLines.push(lines[i]);
                    i++;
                  }
                  i--;

                  if (tableLines.length >= 2) {
                    const headerCells = tableLines[0]
                      .split('|')
                      .slice(1, -1)
                      .map((c) => c.trim());
                    const bodyLines = tableLines.slice(2);

                    elements.push(
                      <table
                        key={`tbl-${i}`}
                        className='table-auto border-collapse mb-4 w-full text-sm'
                      >
                        <thead>
                          <tr>
                            {headerCells.map((h, idx) => (
                              <th
                                key={idx}
                                className='border px-2 py-1 bg-gray-100 font-semibold'
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bodyLines.map((row, ridx) => {
                            const cells = row
                              .split('|')
                              .slice(1, -1)
                              .map((c) => c.trim());
                            return (
                              <tr key={ridx}>
                                {cells.map((c, cidx) => (
                                  <td key={cidx} className='border px-2 py-1'>
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );
                    continue;
                  }
                }

                if (line.startsWith('# ')) {
                  elements.push(
                    <h1
                      key={i}
                      className='text-2xl font-bold text-gray-900 mb-4 mt-6'
                    >
                      {line.slice(2)}
                    </h1>
                  );
                  continue;
                }
                if (line.startsWith('## ')) {
                  elements.push(
                    <h2
                      key={i}
                      className='text-xl font-bold text-gray-900 mb-3 mt-5'
                    >
                      {line.slice(3)}
                    </h2>
                  );
                  continue;
                }
                if (line.startsWith('### ')) {
                  elements.push(
                    <h3
                      key={i}
                      className='text-lg font-semibold text-gray-900 mb-2 mt-4'
                    >
                      {line.slice(4)}
                    </h3>
                  );
                  continue;
                }

                if (line.startsWith('- ')) {
                  const raw = line.slice(2);
                  const parts = raw.split(/(\*\*[^*]+\*\*)/g);
                  elements.push(
                    <li key={i} className='text-gray-700 mb-1 ml-4'>
                      {parts.map((part, idx) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={idx} className='font-bold text-gray-900'>
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <span key={idx}>{part}</span>
                        )
                      )}
                    </li>
                  );
                  continue;
                }

                if (/^\*\*예시:\*\*\s*/.test(line)) {
                  const content = line.replace(/^\*\*예시:\*\*\s*/, '');
                  elements.push(
                    <div key={i} className='bg-blue-50 p-3 rounded-lg mb-3'>
                      <p className='text-blue-800 font-semibold'>
                        예시: {content}
                      </p>
                    </div>
                  );
                  continue;
                }

                if (line.includes('**')) {
                  const parts = line.split(/(\*\*(?!예시:)[^*]+\*\*)/g);
                  elements.push(
                    <p key={i} className='text-gray-700 mb-3 leading-relaxed'>
                      {parts.map((part, idx) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={idx} className='font-bold text-gray-900'>
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  );
                  continue;
                }

                if (line.startsWith('**Q:')) {
                  elements.push(
                    <div key={i} className='bg-gray-50 p-3 rounded-lg mb-2'>
                      <p className='font-semibold text-gray-900'>{line}</p>
                    </div>
                  );
                  continue;
                }
                if (line.startsWith('A:')) {
                  elements.push(
                    <div
                      key={i}
                      className='bg-green-50 p-3 rounded-lg mb-3 ml-4'
                    >
                      <p className='text-green-800'>{line}</p>
                    </div>
                  );
                  continue;
                }

                if (line.trim() === '---') {
                  elements.push(
                    <hr key={i} className='my-6 border-gray-200' />
                  );
                  continue;
                }

                if (line.trim() !== '') {
                  elements.push(
                    <p key={i} className='text-gray-700 mb-3 leading-relaxed'>
                      {line}
                    </p>
                  );
                }
              }
              return elements;
            })()}
          </div>
        </div>
      </div>
      {relatedArticles.length > 0 && (
        <div>
          <div className='p-4'>
            <h3 className='font-semibold text-gray-900 mb-3'>
              이런 글도 읽어보세요
            </h3>
            <div className='space-y-3'>
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer'
                  onClick={() => handleNavigate(rel.id)}
                >
                  <div className='w-12 h-12 bg-gray-200 rounded-lg overflow-hidden'>
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm text-gray-900'>
                      {rel.title}
                    </p>
                    <p className='text-xs text-gray-600'>{rel.views} 조회</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
