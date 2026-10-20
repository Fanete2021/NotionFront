import type { Metadata } from 'next';
import { getPublicArticle } from '@entities/published-document';

type ArticleMetadataProps = {
  params: Promise<{ slug: string }>;
};

const fallbackMetadata: Metadata = { title: 'Публикация | NotionFront' };

export const generateArticleMetadata = async ({
  params,
}: ArticleMetadataProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const document = await getPublicArticle(slug);

    if (!document) return fallbackMetadata;

    return {
      title: `${document.seoTitle || document.title} | NotionFront`,
      description: document.seoDescription || undefined,
    };
  } catch {
    return fallbackMetadata;
  }
};
