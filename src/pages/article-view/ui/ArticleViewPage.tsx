import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@widgets/article-view';
import { ArticleContent } from '@widgets/article-content';
import { PublicHeader } from '@widgets/public-header';
import { mockPublishedDocuments } from '@entities/published-document';

type ArticleViewPageProps = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: ArticleViewPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const document = mockPublishedDocuments.find((item) => item.slug === slug);

  return {
    title: document ? `${document.title} | NotionFront` : 'Публикация не найдена | NotionFront',
    description: document?.description,
  };
};

export const ArticleViewPage = async ({ params }: ArticleViewPageProps) => {
  const { slug } = await params;
  const document = mockPublishedDocuments.find((item) => item.slug === slug);

  if (!document) notFound();

  return (
    <>
      <PublicHeader />
      <ArticleView document={document}>
        <ArticleContent blocks={document.content} />
      </ArticleView>
    </>
  );
};
