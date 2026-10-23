import 'server-only';
import { cache } from 'react';
import type { PublicArticleDetailEntity } from '../model/public-article.types';

export const getPublicArticle = cache(
  async (slug: string): Promise<PublicArticleDetailEntity | null> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) {
      throw new Error('Не задан адрес API');
    }

    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/public/articles/${encodeURIComponent(slug)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) },
    );

    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(`Не удалось загрузить статью: ${response.status}`);
    }

    return response.json();
  },
);
