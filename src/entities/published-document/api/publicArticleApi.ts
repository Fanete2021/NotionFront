import type {
  GetPublicArticleParams,
  PublicArticleDetailEntity,
  PublicArticleListEntity,
  PublishPageDto,
  PublishPageResponse,
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
      providesTags: [{ type: 'PublishedPage', id: 'LIST' }],
    }),
    getArticleSlug: builder.query<PublicArticleDetailEntity, { slug: string }>({
      query: ({ slug }) => ({
        url: `public/articles/${encodeURIComponent(slug)}`,
        method: 'GET',
      }),
      extraOptions: {
        requiresAuth: false,
      },
      providesTags: (result) => (result?.id ? [{ type: 'PublishedPage', id: result.id }] : []),
    }),
    publishArticle: builder.mutation<PublishPageResponse, { pageId: string; body: PublishPageDto }>(
      {
        query: ({ body, pageId }) => ({
          url: `pages/${encodeURIComponent(pageId)}/publication`,
          method: 'PATCH',
          body,
        }),
        extraOptions: {
          requiresAuth: true,
        },
        invalidatesTags: (result, error, { pageId }) =>
          error || !result
            ? []
            : [
                { type: 'PublishedPage', id: pageId },
                { type: 'PublishedPage', id: 'LIST' },
                { type: 'Page', id: pageId },
              ],
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetArticleListQuery, useGetArticleSlugQuery, usePublishArticleMutation } =
  publishedDocumentApi;
