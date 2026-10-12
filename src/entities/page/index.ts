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
  UserPageData,
} from './model/page.types';

export { usePagePresence } from './model/hooks/usePagePresence';

export { PageSessionContext, usePageSession } from './model/page-session-context';
