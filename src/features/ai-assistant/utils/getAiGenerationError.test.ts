import { describe, expect, it } from 'vitest';
import { getAiGenerationError } from './getAiGenerationError';

describe('getAiGenerationError', () => {
  it.each([
    [409, 'conflict', 'Генерация уже идёт'],
    [503, 'unavailable', 'ИИ временно недоступен'],
    [502, 'provider', 'Не удалось сгенерировать, попробуйте ещё раз'],
    [504, 'provider', 'Не удалось сгенерировать, попробуйте ещё раз'],
    ['TIMEOUT_ERROR', 'provider', 'Не удалось сгенерировать, попробуйте ещё раз'],
    ['FETCH_ERROR', 'provider', 'Не удалось сгенерировать, попробуйте ещё раз'],
  ])('обрабатывает статус %s', (status, kind, title) => {
    expect(getAiGenerationError({ status })).toMatchObject({ kind, title });
  });

  it('распознаёт отсутствие провайдера в SSE-ошибке при HTTP 200', () => {
    expect(
      getAiGenerationError({ status: 'CUSTOM_ERROR', error: 'AI provider is not configured' }),
    ).toMatchObject({ kind: 'unavailable' });
  });

  it('читает код ошибки из данных SSE', () => {
    expect(
      getAiGenerationError({
        status: 'CUSTOM_ERROR',
        error: 'Provider timeout',
        data: { statusCode: 504 },
      }),
    ).toMatchObject({ kind: 'provider' });
  });

  it('разбирает JSON из текстового HTTP-ответа', () => {
    expect(
      getAiGenerationError({ status: 500, data: '{"statusCode":503,"message":"Unavailable"}' }),
    ).toMatchObject({ kind: 'unavailable' });
  });

  it('сохраняет сообщение неизвестной серверной ошибки', () => {
    expect(
      getAiGenerationError({ status: 'CUSTOM_ERROR', error: 'Поток завершился без done' }),
    ).toMatchObject({ kind: 'other', description: 'Поток завершился без done' });
  });

  it.each([null, undefined, new Error('Client error')])(
    'обрабатывает неизвестный формат %s',
    (error) => {
      expect(getAiGenerationError(error)).toMatchObject({
        kind: 'other',
        description: 'Не удалось получить ответ сервера. Повторите запрос',
      });
    },
  );
});
