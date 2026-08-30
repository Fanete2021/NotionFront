import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export function getErrorMessage(error: unknown): string {
  if (!isFetchBaseQueryError(error)) {
    return 'Произошла ошибка';
  }

  if (typeof error.status !== 'number') {
    return 'Произошла ошибка';
  }

  switch (error.status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Ошибка валидации данных';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Неверные учетные данные';
    case HTTP_STATUS.FORBIDDEN:
      return 'Доступ запрещен';
    case HTTP_STATUS.NOT_FOUND:
      return 'Ресурс не найден';
    case HTTP_STATUS.CONFLICT:
      return 'Конфликт данных';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Внутренняя ошибка сервера';
    default:
      return 'Произошла ошибка';
  }
}

export type FieldErrorMap = Partial<Record<number, { field: string; message: string }>>;

export type MutationErrorResult = {
  message: string | null;
  fieldErrors: Record<string, string>;
};

export function processMutationError(
  error: unknown,
  fieldMap?: FieldErrorMap,
): MutationErrorResult {
  if (!isFetchBaseQueryError(error)) {
    return {
      message: 'Произошла ошибка',
      fieldErrors: {},
    };
  }

  if (typeof error.status !== 'number') {
    return {
      message: 'Произошла ошибка',
      fieldErrors: {},
    };
  }

  const fieldError = fieldMap?.[error.status];

  if (fieldError) {
    return {
      message: null,
      fieldErrors: {
        [fieldError.field]: fieldError.message,
      },
    };
  }

  return {
    message: getErrorMessage(error),
    fieldErrors: {},
  };
}
