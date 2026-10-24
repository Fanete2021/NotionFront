import type { CreatePageCommentDto, PageComment } from '../model/page-comment.types';
import { removePageComment, upsertPageComment } from '../lib/pageCommentsCache';
import { baseApi } from '@/shared/api';

type CommentArgs = { pageId: string; commentId: string };

// Список правим ответом сервера сразу, без перезапроса: то же событие потом придёт по сокету.
export const pageCommentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPageComments: builder.query<PageComment[], string>({
      query: (pageId) => ({
        url: `pages/${pageId}/comments`,
        method: 'GET',
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, pageId) => [{ type: 'PageComment', id: pageId }],
    }),

    createPageComment: builder.mutation<
      PageComment,
      { pageId: string; body: CreatePageCommentDto }
    >({
      query: ({ pageId, body }) => ({
        url: `pages/${pageId}/comments`,
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
      async onQueryStarted({ pageId }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) dispatch(updateCachedComments(pageId, (draft) => upsertPageComment(draft, data)));
      },
    }),

    updatePageComment: builder.mutation<PageComment, CommentArgs & { body: string }>({
      query: ({ pageId, commentId, body }) => ({
        url: `pages/${pageId}/comments/${commentId}`,
        method: 'PATCH',
        body: { body },
      }),
      extraOptions: { requiresAuth: true },
      async onQueryStarted({ pageId }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) dispatch(updateCachedComments(pageId, (draft) => upsertPageComment(draft, data)));
      },
    }),

    setPageCommentResolved: builder.mutation<PageComment, CommentArgs & { resolved: boolean }>({
      query: ({ pageId, commentId, resolved }) => ({
        url: `pages/${pageId}/comments/${commentId}/resolved`,
        method: 'PATCH',
        body: { resolved },
      }),
      extraOptions: { requiresAuth: true },
      async onQueryStarted({ pageId }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) dispatch(updateCachedComments(pageId, (draft) => upsertPageComment(draft, data)));
      },
    }),

    deletePageComment: builder.mutation<void, CommentArgs>({
      query: ({ pageId, commentId }) => ({
        url: `pages/${pageId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      async onQueryStarted({ pageId, commentId }, { dispatch, queryFulfilled }) {
        const isDeleted = await queryFulfilled.then(
          () => true,
          () => false,
        );
        if (isDeleted) {
          dispatch(updateCachedComments(pageId, (draft) => removePageComment(draft, commentId)));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const updateCachedComments = (pageId: string, recipe: (draft: PageComment[]) => void) =>
  pageCommentApi.util.updateQueryData('getPageComments', pageId, recipe);

export const {
  useGetPageCommentsQuery,
  useCreatePageCommentMutation,
  useUpdatePageCommentMutation,
  useSetPageCommentResolvedMutation,
  useDeletePageCommentMutation,
} = pageCommentApi;
