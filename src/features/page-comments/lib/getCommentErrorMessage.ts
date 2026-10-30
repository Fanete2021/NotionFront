import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { getErrorMessage, isFetchBaseQueryError } from '@shared/utils/error-utils';

export const getCommentErrorMessage = (error: unknown): string => {
  if (!isFetchBaseQueryError(error)) return 'Не удалось выполнить действие';

  switch (error.status) {
    case HTTP_STATUS.FORBIDDEN:
      return 'Менять и удалять можно только свои комментарии';
    case HTTP_STATUS.NOT_FOUND:
      return 'Комментарий или страница уже удалены';
    case HTTP_STATUS.BAD_REQUEST:
      return 'Комментарий не может быть пустым';
    default:
      return getErrorMessage(error) ?? 'Не удалось выполнить действие';
  }
};
