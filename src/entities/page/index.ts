import { pageApi } from './api/pageApi';

export const {
  useGetPagesByWorkspaceQuery,
  useGetPageByIdQuery,
  useGetPageContentQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useUpdatePageContentMutation,
  useDeletePageMutation,
  useGetPageVersionsQuery,
} = pageApi;

export { PAGE_TYPE } from './model/page.types';

export type {
  Page,
  PageType,
  CreatePageDto,
  UpdatePageDto,
  PageContent,
  PageContentJson,
  PageVersion,
  PageVersionList,
} from './model/page.types';
