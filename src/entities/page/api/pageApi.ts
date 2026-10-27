import {
  CreatePageDto,
  UpdatePageDto,
  ReorderPagesDto,
  PageContent,
  PageContentJson,
  PageVersionList,
  RestorePageVersionDto,
  SearchPagesParams,
  PageSearchResult,
} from '../model/page.types';
import { Page } from '@/shared/const/pageType';
import { baseApi } from '@/shared/api';

export const pageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPageById: builder.query<Page, string>({
      query: (id) => ({
        url: `pages/${id}`,
        method: 'GET',
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, id) => [{ type: 'Page', id }],
    }),

    getPageContent: builder.query<PageContent, string>({
      query: (id) => ({
        url: `pages/${id}/content`,
        method: 'GET',
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, id) => [{ type: 'PageContent', id }],
    }),

    updatePageContent: builder.mutation<PageContent, { id: string; body: PageContentJson }>({
      query: ({ id, body }) => ({
        url: `pages/${id}/content`,
        method: 'PUT',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id }) =>
        error
          ? []
          : [
              { type: 'PageContent', id },
              { type: 'PageVersion', id },
              { type: 'Page', id },
              { type: 'Page', id: 'LIST' },
            ],
    }),

    getPagesByWorkspace: builder.query<Page[], { workspaceId: string; projectId?: string }>({
      query: ({ workspaceId, projectId }) => ({
        url: `workspaces/${workspaceId}/pages`,
        method: 'GET',
        params: projectId ? { projectId } : undefined,
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, { workspaceId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Page' as const, id })),
              { type: 'Page' as const, id: `WORKSPACE_${workspaceId}` },
            ]
          : [{ type: 'Page' as const, id: `WORKSPACE_${workspaceId}` }],
    }),

    searchPages: builder.query<PageSearchResult[], SearchPagesParams>({
      query: ({ workspaceId, ...params }) => ({
        url: `workspaces/${workspaceId}/pages/search`,
        method: 'GET',
        params,
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, { workspaceId }) => [
        { type: 'Page', id: 'LIST' },
        { type: 'Page', id: `WORKSPACE_${workspaceId}` },
        ...(result ?? []).map(({ pageId }) => ({ type: 'Page' as const, id: pageId })),
      ],
    }),

    createPage: builder.mutation<Page, { body: CreatePageDto }>({
      query: ({ body }) => ({
        url: 'pages',
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { body: { workspaceId } }) =>
        error ? [] : [{ type: 'Page', id: `WORKSPACE_${workspaceId}` }],
    }),

    updatePage: builder.mutation<Page, { id: string; workspaceId: string; body: UpdatePageDto }>({
      query: ({ id, body }) => ({
        url: `pages/${id}`,
        method: 'PATCH',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) =>
        error
          ? []
          : [
              { type: 'Page', id },
              { type: 'Page', id: `WORKSPACE_${workspaceId}` },
            ],
    }),

    reorderPages: builder.mutation<Page[], { workspaceId: string; body: ReorderPagesDto }>({
      query: ({ workspaceId, body }) => ({
        url: `workspaces/${workspaceId}/pages/order`,
        method: 'PATCH',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { workspaceId }) =>
        error ? [] : [{ type: 'Page', id: `WORKSPACE_${workspaceId}` }],
    }),

    deletePage: builder.mutation<void, { id: string; workspaceId: string }>({
      query: ({ id }) => ({
        url: `pages/${id}`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) =>
        error
          ? []
          : [
              { type: 'Page', id },
              { type: 'Page', id: `WORKSPACE_${workspaceId}` },
              { type: 'Page', id: `TRASH_${workspaceId}` },
            ],
    }),

    getPageVersions: builder.infiniteQuery<PageVersionList, string, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchCachedPages: false,
      },
      query: ({ queryArg, pageParam }) => ({
        url: `pages/${queryArg}/versions`,
        method: 'GET',
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, id) => [{ type: 'PageVersion', id }],
    }),

    restorePageVersion: builder.mutation<PageContent, RestorePageVersionDto>({
      query: ({ versionId }) => ({
        url: `versions/${versionId}/restore`,
        method: 'POST',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { pageId }) =>
        error
          ? []
          : [
              { type: 'PageContent', id: pageId },
              { type: 'PageVersion', id: pageId },
              { type: 'Page', id: pageId },
              { type: 'Page', id: 'LIST' },
            ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPagesByWorkspaceQuery,
  useSearchPagesQuery,
  useGetPageByIdQuery,
  useGetPageContentQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useReorderPagesMutation,
  useUpdatePageContentMutation,
  useDeletePageMutation,
  useGetPageVersionsInfiniteQuery,
  useRestorePageVersionMutation,
} = pageApi;
