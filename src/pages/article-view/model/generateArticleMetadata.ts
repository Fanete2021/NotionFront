import type { Metadata } from 'next';
import type { PublicArticleDetailEntity } from '@entities/published-document';

type ArticleMetadataProps = { params: Promise<{ slug: string }> };

const fallbackMetadata: Metadata = { title: 'Публикация | NotionFront' };

export const generateArticleMetadata = async ({
  params,
}: ArticleMetadataProps): Promise<Metadata> => {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!baseUrl) return fallbackMetadata;

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/public/articles/${encodeURIComponent(slug)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok) return fallbackMetadata;

    const document: PublicArticleDetailEntity = await response.json();

    return {
      title: `${document.seoTitle || document.title} | NotionFront`,
      description: document.seoDescription || undefined,
    };
  } catch {
    return fallbackMetadata;
  }
};
