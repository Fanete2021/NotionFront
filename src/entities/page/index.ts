import { pageApi } from './api/pageApi';

export const {
  useGetPagesByWorkspaceQuery,
  useGetPageByIdQuery,
  useGetPageContentQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useUpdatePageContentMutation,
  useDeletePageMutation,
} = pageApi;

export type {
  CreatePageDto,
  UpdatePageDto,
  PageContent,
  PageContentJson,
} from './model/page.types';
