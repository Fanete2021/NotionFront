import { describe, it, expect } from 'vitest';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isFetchBaseQueryError, getErrorMessage } from './errorUtils';

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

  it('should return false for string', () => {
    expect(isFetchBaseQueryError('error')).toBe(false);
  });

  it('should return false for number', () => {
    expect(isFetchBaseQueryError(404)).toBe(false);
  });

  it('should return false for object without status', () => {
    expect(isFetchBaseQueryError({ message: 'error' })).toBe(false);
  });

  it('should return false for Error instance', () => {
    expect(isFetchBaseQueryError(new Error('test'))).toBe(false);
  });
});

describe('getErrorMessage', () => {
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

  it('should return "Произошла ошибка" for null', () => {
    expect(getErrorMessage(null)).toBe('Произошла ошибка');
  });

  it('should return "Произошла ошибка" for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('Произошла ошибка');
  });

  it('should return "Произошла ошибка" for string', () => {
    expect(getErrorMessage('string')).toBe('Произошла ошибка');
  });

  it('should return "Произошла ошибка" for number', () => {
    expect(getErrorMessage(500)).toBe('Произошла ошибка');
  });
});
