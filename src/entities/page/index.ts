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

export { PAGE_TYPE } from './model/page.types';

export type {
  Page,
  PageType,
  CreatePageDto,
  UpdatePageDto,
  PageContent,
  PageContentJson,
} from './model/page.types';
