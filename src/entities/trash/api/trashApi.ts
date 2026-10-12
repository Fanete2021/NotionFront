import { EmptyTrashResult, GetTrashParams, TrashedPage } from '../model/trash.types';
import { baseApi } from '@/shared/api/baseApi';

export const trashApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrashedPages: builder.query<TrashedPage[], GetTrashParams>({
      query: ({ workspaceId, q }) => ({
        url: `/workspaces/${workspaceId}/pages/trash`,
        params: q ? { q } : undefined,
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, { workspaceId }) => [
        { type: 'Page', id: `TRASH_${workspaceId}` },
      ],
    }),

    emptyTrash: builder.mutation<EmptyTrashResult, string>({
      query: (workspaceId) => ({
        url: `/workspaces/${workspaceId}/pages/trash`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, workspaceId) => [
        { type: 'Page', id: `TRASH_${workspaceId}` },
        { type: 'Page', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    restorePage: builder.mutation<void, { id: string; workspaceId: string }>({
      query: ({ id }) => ({
        url: `/pages/${id}/restore`,
        method: 'POST',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) => [
        { type: 'Page', id },
        { type: 'Page', id: `TRASH_${workspaceId}` },
        { type: 'Page', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    hardDeletePage: builder.mutation<void, { id: string; workspaceId: string }>({
      query: ({ id }) => ({
        url: `/pages/${id}/hard`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'Page', id: `TRASH_${workspaceId}` },
      ],
    }),
  }),
  overrideExisting: false,
});
