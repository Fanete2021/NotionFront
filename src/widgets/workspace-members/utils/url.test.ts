import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildInviteUrl } from './url';

describe('buildInviteUrl', () => {
  const mockInviteId = 'abc-123-def-456';

  describe('на клиенте (браузер)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://notiontv.ru',
        },
        writable: true,
      });
    });

    it('должен возвращать полный URL с origin', () => {
      const result = buildInviteUrl(mockInviteId);
      expect(result).toBe('https://notiontv.ru/join/abc-123-def-456');
    });

    it('должен корректно работать с разными inviteId', () => {
      expect(buildInviteUrl('test-1')).toBe('https://notiontv.ru/join/test-1');
      expect(buildInviteUrl('user-42')).toBe('https://notiontv.ru/join/user-42');
      expect(buildInviteUrl('')).toBe('https://notiontv.ru/join/');
    });

    it('должен использовать актуальный window.location.origin', () => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://staging.notiontv.ru',
        },
        writable: true,
      });

      const result = buildInviteUrl(mockInviteId);
      expect(result).toBe('https://staging.notiontv.ru/join/abc-123-def-456');
    });
  });

  describe('на сервере (SSR)', () => {
    const originalWindow = global.window;

    beforeEach(() => {
      // @ts-expect-error Удаляем window для эмуляции сервера
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('должен возвращать относительный путь на сервере', () => {
      const result = buildInviteUrl(mockInviteId);
      expect(result).toBe('/join/abc-123-def-456');
    });

    it('должен корректно работать с разными inviteId на сервере', () => {
      expect(buildInviteUrl('test-1')).toBe('/join/test-1');
      expect(buildInviteUrl('user-42')).toBe('/join/user-42');
      expect(buildInviteUrl('')).toBe('/join/');
    });
  });

  describe('edge cases', () => {
    it('должен обрабатывать спецсимволы в inviteId', () => {
      const specialId = 'invite!@#$%^&*()';
      expect(buildInviteUrl(specialId)).toContain(`/join/${specialId}`);
    });

    it('должен обрабатывать очень длинный inviteId', () => {
      const longId = 'a'.repeat(1000);
      const result = buildInviteUrl(longId);
      expect(result).toContain(`/join/${longId}`);
    });

    it('должен обрабатывать inviteId с пробелами', () => {
      const idWithSpace = 'invite 123';
      const result = buildInviteUrl(idWithSpace);
      expect(result).toContain(`/join/${idWithSpace}`);
    });
  });
});
