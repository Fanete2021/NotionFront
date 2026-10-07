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

export type {
  CreatePageDto,
  UpdatePageDto,
  PageContent,
  PageContentJson,
  PageVersion,
  PageVersionList,
} from './model/page.types';

export { usePagePresence } from './model/hooks/usePagePresence';
