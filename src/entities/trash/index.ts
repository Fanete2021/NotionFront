export {
  useGetTrashedPagesQuery,
  useEmptyTrashMutation,
  useRestorePageMutation,
  useHardDeletePageMutation,
} from './api/trashApi';

export type { TrashedPage, GetTrashParams, EmptyTrashResult } from './model/trash.types';
