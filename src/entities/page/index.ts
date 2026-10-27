export {
  useGetPagesByWorkspaceQuery,
  useSearchPagesQuery,
  useGetPageByIdQuery,
  useGetPageContentQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useReorderPagesMutation,
  useUpdatePageContentMutation,
  useDeletePageMutation,
  useGetPageVersionsInfiniteQuery,
  useRestorePageVersionMutation,
} from './api/pageApi';

export type {
  CreatePageDto,
  UpdatePageDto,
  ReorderPagesDto,
  PageContent,
  PageContentJson,
  PageVersion,
  PageVersionList,
  UserPageData,
  RestorePageVersionDto,
  SearchPagesParams,
  PageSearchResult,
} from './model/page.types';

export { usePagePresence } from './model/hooks/usePagePresence';

export { PageSessionContext, usePageSession } from './model/page-session-context';

export { YjsSocketProvider } from './model/yjs-provider/YjsSocketProvider';
export { useYjsProvider } from './model/yjs-provider/useYjsProvider';
export { PageSessionProvider } from './ui/PageSessionProvider';
