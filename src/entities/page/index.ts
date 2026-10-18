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
  UserPageData,
} from './model/page.types';

export { usePagePresence } from './model/hooks/usePagePresence';

export { PageSessionContext, usePageSession } from './model/page-session-context';

export { YjsSocketProvider } from './model/yjs-provider/YjsSocketProvider';
export { useYjsProvider } from './model/yjs-provider/useYjsProvider';
export { PageSessionProvider } from './ui/PageSessionProvider';
