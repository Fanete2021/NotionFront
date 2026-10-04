import { trashApi } from './api/trashApi';

export const {
  useGetTrashedPagesQuery,
  useEmptyTrashMutation,
  useRestorePageMutation,
  useHardDeletePageMutation,
} = trashApi;

export type { TrashedPage, GetTrashParams, EmptyTrashResult } from './model/trash.types';
