import { pageApi } from './api/pageApi';

export const {
  useGetPagesByWorkspaceQuery,
  useGetPageByIdQuery,
  useGetPageContentQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useReorderPagesMutation,
  useUpdatePageContentMutation,
  useDeletePageMutation,
  useGetPageVersionsQuery,
} = pageApi;

export type {
  CreatePageDto,
  UpdatePageDto,
  ReorderPagesDto,
  PageContent,
  PageContentJson,
  PageVersion,
  PageVersionList,
} from './model/page.types';
