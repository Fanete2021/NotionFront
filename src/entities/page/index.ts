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
} = pageApi;

export { PAGE_TYPE } from './model/page.types';

export type {
  Page,
  PageType,
  CreatePageDto,
  UpdatePageDto,
  ReorderPagesDto,
  PageContent,
  PageContentJson,
} from './model/page.types';
