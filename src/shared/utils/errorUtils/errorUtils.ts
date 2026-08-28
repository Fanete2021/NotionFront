import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    switch (error.status) {
      case 400:
        return 'Ошибка валидации данных';
      case 401:
        return 'Неверные учетные данные';
      case 403:
        return 'Доступ запрещен';
      case 404:
        return 'Ресурс не найден';
      case 409:
        return 'Этот email уже используется';
      case 500:
        return 'Внутренняя ошибка сервера';
      default:
        return 'Произошла ошибка';
    }
  }
  if (error instanceof Error) {
    return 'Произошла ошибка';
  }
  return 'Произошла ошибка';
}
