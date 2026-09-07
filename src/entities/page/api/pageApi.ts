import {
  Page,
  CreatePageDto,
  UpdatePageDto,
  PageContent,
  PageContentJson,
} from '../model/page.types';
import { baseApi } from '@/shared/api/baseApi';

export const pageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPageById: builder.query<Page, string>({
      query: (id) => ({
        url: `/pages/${id}`,
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, id) => [{ type: 'Page', id }],
    }),

    getPageContent: builder.query<PageContent, string>({
      query: (id) => ({
        url: `/pages/${id}/content`,
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, id) => [{ type: 'PageContent', id }],
    }),

    updatePageContent: builder.mutation<PageContent, { id: string; json: PageContentJson }>({
      query: ({ id, json }) => ({
        url: `/pages/${id}/content`,
        method: 'PUT',
        body: json,
      }),
      extraOptions: { requiresAuth: true },
    }),

    getPagesByWorkspace: builder.query<Page[], { workspaceId: string; projectId?: string }>({
      query: ({ workspaceId, projectId }) => ({
        url: `/workspaces/${workspaceId}/pages`,
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

    createPage: builder.mutation<Page, CreatePageDto>({
      query: (body) => ({
        url: '/pages',
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'Page', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    updatePage: builder.mutation<Page, { id: string; workspaceId: string; data: UpdatePageDto }>({
      query: ({ id, data }) => ({
        url: `/pages/${id}`,
        method: 'PATCH',
        body: data,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) => [
        { type: 'Page', id },
        { type: 'Page', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    deletePage: builder.mutation<void, { id: string; workspaceId: string }>({
      query: ({ id }) => ({
        url: `/pages/${id}`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) => [
        { type: 'Page', id },
        { type: 'Page', id: `WORKSPACE_${workspaceId}` },
      ],
    }),
  }),
  overrideExisting: false,
});
