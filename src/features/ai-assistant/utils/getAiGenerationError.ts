import type { AiGenerationError } from '../model/ai-types';
import { isFetchBaseQueryError } from '@shared/utils/error-utils';

export function getAiGenerationError(error: unknown): AiGenerationError {
  let status: number | string | undefined;
  let message = '';

  if (isFetchBaseQueryError(error)) {
    status = error.status;
    let data = error.data;
    if (typeof data === 'string') {
      message = data;
      try {
        const parsed: unknown = JSON.parse(data);
        data = parsed;
      } catch {
        // HTTP-ошибка может содержать обычный текст вместо JSON.
      }
    }
    if (typeof data === 'object' && data !== null) {
      if ('statusCode' in data && typeof data.statusCode === 'number') status = data.statusCode;
      if ('message' in data && typeof data.message === 'string') message = data.message;
    }
    if (!message && 'error' in error) message = error.error;
  }

  if (status === 409) {
    return {
      kind: 'conflict',
      title: 'Генерация уже идёт',
      description: 'Дождитесь завершения предыдущей генерации или отмените её',
    };
  }
  if (status === 503 || /provider is not configured|сервис.*не настроен/i.test(message)) {
    return {
      kind: 'unavailable',
      title: 'ИИ временно недоступен',
      description: 'Сервис ещё не настроен. Обратитесь к администратору рабочего пространства',
    };
  }
  if (status === 502 || status === 504 || status === 'TIMEOUT_ERROR' || status === 'FETCH_ERROR') {
    return {
      kind: 'provider',
      title: 'Не удалось сгенерировать, попробуйте ещё раз',
      description: 'Ошибка или превышено время ожидания ответа провайдера',
    };
  }
  return {
    kind: 'other',
    title: 'Не удалось сгенерировать, попробуйте ещё раз',
    description: message || 'Не удалось получить ответ сервера. Повторите запрос',
  };
}
