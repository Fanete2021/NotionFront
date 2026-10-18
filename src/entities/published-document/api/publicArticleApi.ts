import type {
  GetPublicArticleParams,
  PublicArticleDetailEntity,
  PublicArticleListEntity,
} from '@entities/published-document/model/public-article.types';
import { baseApi } from '@shared/api';

export const publishedDocumentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticleList: builder.query<PublicArticleListEntity, GetPublicArticleParams>({
      query: (params) => ({
        url: 'public/articles',
        method: 'GET',
        params,
      }),
      extraOptions: {
        requiresAuth: false,
      },
    }),
    getArticleSlug: builder.query<PublicArticleDetailEntity, { slug: string }>({
      query: ({ slug }) => ({
        url: `public/articles/${encodeURIComponent(slug)}`,
        method: 'GET',
      }),
      extraOptions: {
        requiresAuth: false,
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetArticleListQuery, useGetArticleSlugQuery } = publishedDocumentApi;
