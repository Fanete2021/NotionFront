import { describe, expect, it } from 'vitest';
import { getCommentErrorMessage } from './getCommentErrorMessage';

describe('getCommentErrorMessage', () => {
  it('объясняет запрет на чужой комментарий', () => {
    expect(getCommentErrorMessage({ status: 403, data: null })).toBe(
      'Менять и удалять можно только свои комментарии',
    );
  });

  it('сообщает, что комментарий уже удалён', () => {
    expect(getCommentErrorMessage({ status: 404, data: null })).toBe(
      'Комментарий или страница уже удалены',
    );
  });

  it('берёт общий текст для остальных статусов', () => {
    expect(getCommentErrorMessage({ status: 500, data: null })).toBe('Внутренняя ошибка сервера');
  });

  it('не падает на ошибке не от сервера', () => {
    expect(getCommentErrorMessage(new Error('boom'))).toBe('Не удалось выполнить действие');
  });
});
