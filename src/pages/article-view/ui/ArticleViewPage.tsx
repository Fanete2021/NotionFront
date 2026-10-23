import { notFound } from 'next/navigation';
import { ArticleView } from '@widgets/article-view';
import { ArticleContent } from '@widgets/article-content';
import { PublicHeader } from '@widgets/public-header';
import { getPublicArticle } from '@entities/published-document/server';

type ArticleViewPageProps = {
  params: Promise<{ slug: string }>;
};

export const ArticleViewPage = async ({ params }: ArticleViewPageProps) => {
  const { slug } = await params;
  const document = await getPublicArticle(slug);

  if (!document) notFound();

  return (
    <>
      <PublicHeader />
      <ArticleView document={document}>
        <ArticleContent content={document.content.json} />
      </ArticleView>
    </>
  );
};
