import { describe, expect, it } from 'vitest';
import { buildEventFormDefaults } from './buildEventFormDefaults';
import type { CalendarEvent } from '@entities/calendar';

const makeEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'event-1',
  workspaceId: 'ws-1',
  projectId: null,
  title: 'Встреча с командой',
  startAt: new Date(2026, 8, 9, 14, 0).toISOString(),
  endAt: new Date(2026, 8, 9, 14, 30).toISOString(),
  allDay: false,
  createdAt: new Date(2026, 8, 1).toISOString(),
  updatedAt: new Date(2026, 8, 1).toISOString(),
  ...overrides,
});

describe('buildEventFormDefaults', () => {
  describe('режим создания (event отсутствует)', () => {
    it('возвращает дефолтные значения', () => {
      const result = buildEventFormDefaults();
      expect(result).toEqual({
        startTime: '14:00',
        endTime: '14:30',
        taskType: 'meet',
        repeatable: 'no-repeat',
        notifications: false,
        telegramSend: true,
      });
    });

    it('не содержит title, date, project', () => {
      const result = buildEventFormDefaults();
      expect(result.title).toBeUndefined();
      expect(result.date).toBeUndefined();
      expect(result.project).toBeUndefined();
    });
  });

  describe('режим редактирования (event передан)', () => {
    it('берёт title из события', () => {
      const event = makeEvent({ title: 'Синхронизация' });
      expect(buildEventFormDefaults(event).title).toBe('Синхронизация');
    });

    it('выставляет date из startAt', () => {
      const event = makeEvent({
        startAt: new Date(2026, 8, 9, 14, 0).toISOString(),
      });
      const result = buildEventFormDefaults(event);
      expect(result.date).toBeInstanceOf(Date);
      expect((result.date as Date).getFullYear()).toBe(2026);
      expect((result.date as Date).getMonth()).toBe(8);
      expect((result.date as Date).getDate()).toBe(9);
    });

    it('выставляет startTime из startAt', () => {
      const event = makeEvent({
        startAt: new Date(2026, 8, 9, 14, 5).toISOString(),
      });
      expect(buildEventFormDefaults(event).startTime).toBe('14:05');
    });

    it('выставляет endTime из endAt', () => {
      const event = makeEvent({
        endAt: new Date(2026, 8, 9, 16, 45).toISOString(),
      });
      expect(buildEventFormDefaults(event).endTime).toBe('16:45');
    });

    it('прокидывает projectId, если он есть', () => {
      const event = makeEvent({ projectId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' });
      expect(buildEventFormDefaults(event).project).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    });

    it('возвращает project: undefined, если projectId === null', () => {
      const event = makeEvent({ projectId: null });
      expect(buildEventFormDefaults(event).project).toBeUndefined();
    });

    it('сохраняет дефолты для остальных полей', () => {
      const event = makeEvent();
      const result = buildEventFormDefaults(event);
      expect(result.taskType).toBe('meet');
      expect(result.repeatable).toBe('no-repeat');
      expect(result.notifications).toBe(false);
      expect(result.telegramSend).toBe(true);
    });
  });

  describe('не мутирует входные данные', () => {
    it('возвращает новый объект', () => {
      const event = makeEvent();
      const a = buildEventFormDefaults(event);
      const b = buildEventFormDefaults(event);
      expect(a).not.toBe(b);
    });

    it('не изменяет event', () => {
      const event = makeEvent({ title: 'Синхронизация' });
      const before = JSON.stringify(event);
      buildEventFormDefaults(event);
      expect(JSON.stringify(event)).toBe(before);
    });
  });

  describe('часовой пояс', () => {
    it('строит date и время в локальном поясе', () => {
      const localStart = new Date(2026, 8, 9, 14, 0);
      const localEnd = new Date(2026, 8, 9, 14, 30);

      const event = makeEvent({
        startAt: localStart.toISOString(),
        endAt: localEnd.toISOString(),
      });
      const result = buildEventFormDefaults(event);

      const date = result.date as Date;
      expect(date.getHours()).toBe(14);
      expect(date.getMinutes()).toBe(0);
      expect(result.startTime).toBe('14:00');
      expect(result.endTime).toBe('14:30');
    });
  });
});
