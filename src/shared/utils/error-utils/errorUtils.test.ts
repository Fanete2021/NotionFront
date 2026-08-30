import { describe, it, expect } from 'vitest';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  isFetchBaseQueryError,
  getErrorMessage,
  processMutationError,
  processLoginError,
} from './errorUtils';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

describe('isFetchBaseQueryError', () => {
  it('should return true for object with status property', () => {
    const error = { status: 401, data: {} };
    expect(isFetchBaseQueryError(error)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isFetchBaseQueryError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isFetchBaseQueryError(undefined)).toBe(false);
  });

  it('should return false for object without status', () => {
    expect(isFetchBaseQueryError({ message: 'error' })).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('should return null for null error', () => {
    expect(getErrorMessage(null)).toBe(null);
  });

  it('should return null for undefined error', () => {
    expect(getErrorMessage(undefined)).toBe(null);
  });

  it('should return "Ошибка валидации данных" for status 400', () => {
    const error: FetchBaseQueryError = { status: 400, data: {} };
    expect(getErrorMessage(error)).toBe('Ошибка валидации данных');
  });

  it('should return "Неверные учетные данные" for status 401', () => {
    const error: FetchBaseQueryError = { status: 401, data: {} };
    expect(getErrorMessage(error)).toBe('Неверные учетные данные');
  });

  it('should return "Доступ запрещен" for status 403', () => {
    const error: FetchBaseQueryError = { status: 403, data: {} };
    expect(getErrorMessage(error)).toBe('Доступ запрещен');
  });

  it('should return "Ресурс не найден" for status 404', () => {
    const error: FetchBaseQueryError = { status: 404, data: {} };
    expect(getErrorMessage(error)).toBe('Ресурс не найден');
  });

  it('should return "Этот email уже используется" for status 409', () => {
    const error: FetchBaseQueryError = { status: 409, data: {} };
    expect(getErrorMessage(error)).toBe('Этот email уже используется');
  });

  it('should return "Внутренняя ошибка сервера" for status 500', () => {
    const error: FetchBaseQueryError = { status: 500, data: {} };
    expect(getErrorMessage(error)).toBe('Внутренняя ошибка сервера');
  });

  it('should return "Произошла ошибка" for unknown status', () => {
    const error: FetchBaseQueryError = { status: 418, data: {} };
    expect(getErrorMessage(error)).toBe('Произошла ошибка');
  });

  it('should return "Произошла ошибка" for Error instance', () => {
    const error = new Error('some error');
    expect(getErrorMessage(error)).toBe('Произошла ошибка');
  });
});

describe('processMutationError', () => {
  it('should return empty result for null error', () => {
    const result = processMutationError(null);
    expect(result.message).toBe(null);
    expect(result.fieldErrors).toEqual({});
    expect(result.isConflict).toBe(false);
  });

  it('should return empty result for undefined error', () => {
    const result = processMutationError(undefined);
    expect(result.message).toBe(null);
    expect(result.fieldErrors).toEqual({});
    expect(result.isConflict).toBe(false);
  });

  it('should return "Произошла ошибка" for non-FetchBaseQueryError', () => {
    const result = processMutationError(new Error('test'));
    expect(result.message).toBe('Произошла ошибка');
    expect(result.fieldErrors).toEqual({});
    expect(result.isConflict).toBe(false);
  });

  it('should handle custom field map for 400 status', () => {
    const error: FetchBaseQueryError = { status: 400, data: {} };
    const fieldMap = {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'email',
        message: 'Неверный email',
      },
    };
    const result = processMutationError(error, fieldMap);
    expect(result.fieldErrors).toEqual({ email: 'Неверный email' });
    expect(result.message).toBe(null);
    expect(result.isConflict).toBe(false);
  });

  it('should handle custom field map for 409 status', () => {
    const error: FetchBaseQueryError = { status: 409, data: {} };
    const fieldMap = {
      [HTTP_STATUS.CONFLICT]: {
        field: 'email',
        message: 'Email уже используется',
      },
    };
    const result = processMutationError(error, fieldMap);
    expect(result.fieldErrors).toEqual({ email: 'Email уже используется' });
    expect(result.message).toBe(null);
    expect(result.isConflict).toBe(false);
  });

  it('should return default message for unknown status', () => {
    const error: FetchBaseQueryError = { status: 418, data: {} };
    const result = processMutationError(error);
    expect(result.message).toBe('Произошла ошибка');
    expect(result.fieldErrors).toEqual({});
    expect(result.isConflict).toBe(false);
  });

  it('should return error message for 401 status', () => {
    const error: FetchBaseQueryError = { status: 401, data: {} };
    const result = processMutationError(error);
    expect(result.message).toBe('Неверные учетные данные');
    expect(result.fieldErrors).toEqual({});
    expect(result.isConflict).toBe(false);
  });

  it('should return "Произошла ошибка" for unknown status', () => {
    const error: FetchBaseQueryError = { status: 418, data: {} };
    const result = processLoginError(error);
    expect(result.message).toBe('Произошла ошибка');
    expect(result.fieldErrors).toEqual({});
  });
});
