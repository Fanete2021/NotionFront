import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (isFetchBaseQueryError(error)) {
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
        return 'Этот email уже используется';
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return 'Внутренняя ошибка сервера';
      default:
        return 'Произошла ошибка';
    }
  }
  if (error instanceof Error) {
    return 'Произошла ошибка';
  }
  return null;
}

type FieldErrorMap = Partial<Record<number, { field: string; message: string }>>;

export type MutationErrorResult = {
  message: string | null;
  fieldErrors: Record<string, string>;
  isConflict: boolean;
};

export function processMutationError(
  error: unknown,
  fieldMap?: FieldErrorMap,
): MutationErrorResult {
  const result = {
    message: null as string | null,
    fieldErrors: {} as Record<string, string>,
    isConflict: false,
  };

  if (!error) {
    return result;
  }

  if (!isFetchBaseQueryError(error)) {
    result.message = 'Произошла ошибка';
    return result;
  }

  const status = error.status as number;

  if (fieldMap && status in fieldMap) {
    const fieldError = fieldMap[status];
    if (fieldError) {
      result.fieldErrors[fieldError.field] = fieldError.message;
      return result;
    }
  }

  if (status === HTTP_STATUS.CONFLICT) {
    result.isConflict = true;
    result.message = 'Этот email уже используется';
    return result;
  }

  result.message = getErrorMessage(error);
  return result;
}

export function processLoginError(error: unknown): {
  message: string | null;
  fieldErrors: Record<string, string>;
} {
  const result = {
    message: null as string | null,
    fieldErrors: {} as Record<string, string>,
  };

  if (!error) {
    return result;
  }

  if (!isFetchBaseQueryError(error)) {
    result.message = 'Произошла ошибка';
    return result;
  }

  const status = error.status as number;

  if (status === HTTP_STATUS.BAD_REQUEST) {
    result.message = 'Неверный логин или пароль';
    return result;
  }

  result.message = getErrorMessage(error);
  return result;
}
