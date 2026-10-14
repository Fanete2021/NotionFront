import { describe, expect, it } from 'vitest';
import type { CalendarEvent } from '../types/calendar.types';
import { eventToBadgeTask, eventToDayTask } from './eventMappers';

const makeEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: 'event-1',
  workspaceId: 'ws-1',
  projectId: null,
  title: 'Встреча с командой',
  startAt: new Date(2026, 9, 12, 14, 0).toISOString(),
  endAt: new Date(2026, 9, 12, 14, 30).toISOString(),
  allDay: false,
  createdAt: new Date(2026, 9, 1).toISOString(),
  updatedAt: new Date(2026, 9, 1).toISOString(),
  ...overrides,
});

describe('eventToBadgeTask', () => {
  describe('базовое преобразование', () => {
    it('переносит id, title и date', () => {
      const event = makeEvent({
        id: 'abc-123',
        title: 'Синхронизация',
        startAt: new Date(2026, 9, 12, 14, 0).toISOString(),
      });

      const result = eventToBadgeTask(event);

      expect(result.id).toBe('abc-123');
      expect(result.name).toBe('Синхронизация');
      expect(result.date).toBe('2026-10-12');
    });

    it('возвращает дату в локальном часовом поясе', () => {
      const event = makeEvent({
        startAt: new Date(2026, 9, 12, 0, 30).toISOString(),
      });

      expect(eventToBadgeTask(event).date).toBe('2026-10-12');
    });

    it('корректно паддит месяц и день', () => {
      const event = makeEvent({
        startAt: new Date(2026, 0, 5, 12, 0).toISOString(),
      });

      expect(eventToBadgeTask(event).date).toBe('2026-01-05');
    });
  });

  describe('цвет из палитры', () => {
    it('первое событие (index=0) получает indigo', () => {
      expect(eventToBadgeTask(makeEvent(), 0).color).toBe('indigo');
    });

    it('второе (index=1) — green', () => {
      expect(eventToBadgeTask(makeEvent(), 1).color).toBe('green');
    });

    it('третье (index=2) — yellow', () => {
      expect(eventToBadgeTask(makeEvent(), 2).color).toBe('yellow');
    });

    it('четвёртое (index=3) — red', () => {
      expect(eventToBadgeTask(makeEvent(), 3).color).toBe('red');
    });

    it('палитра зацикливается: index=4 → indigo', () => {
      expect(eventToBadgeTask(makeEvent(), 4).color).toBe('indigo');
    });

    it('index=7 → red', () => {
      expect(eventToBadgeTask(makeEvent(), 7).color).toBe('red');
    });

    it('index=8 → indigo (полный круг и снова)', () => {
      expect(eventToBadgeTask(makeEvent(), 8).color).toBe('indigo');
    });

    it('без index использует 0 → indigo', () => {
      expect(eventToBadgeTask(makeEvent()).color).toBe('indigo');
    });
  });

  describe('projectName', () => {
    it('прокидывает projectName, если передан', () => {
      expect(eventToBadgeTask(makeEvent(), 0, 'Продукт').projectName).toBe('Продукт');
    });

    it('без projectName — undefined', () => {
      expect(eventToBadgeTask(makeEvent()).projectName).toBeUndefined();
    });
  });

  describe('иммутабельность', () => {
    it('не мутирует event', () => {
      const event = makeEvent();
      const before = JSON.stringify(event);

      eventToBadgeTask(event, 0, 'Проект');

      expect(JSON.stringify(event)).toBe(before);
    });

    it('возвращает новый объект', () => {
      const event = makeEvent();
      const a = eventToBadgeTask(event);
      const b = eventToBadgeTask(event);

      expect(a).not.toBe(b);
    });
  });
});

describe('eventToDayTask', () => {
  describe('базовое преобразование', () => {
    it('переносит id и title', () => {
      const event = makeEvent({ id: 'abc-123', title: 'Ревью' });
      const result = eventToDayTask(event);

      expect(result.id).toBe('abc-123');
      expect(result.label).toBe('Ревью');
    });

    it('проставляет isCompleted=false и viewed=false', () => {
      const result = eventToDayTask(makeEvent());

      expect(result.isCompleted).toBe(false);
      expect(result.viewed).toBe(false);
    });

    it('формирует time из startAt и endAt в формате HH:mm – HH:mm', () => {
      const event = makeEvent({
        startAt: new Date(2026, 9, 12, 14, 0).toISOString(),
        endAt: new Date(2026, 9, 12, 14, 30).toISOString(),
      });

      expect(eventToDayTask(event).time).toBe('14:00 – 14:30');
    });

    it('паддит часы и минуты', () => {
      const event = makeEvent({
        startAt: new Date(2026, 9, 12, 5, 7).toISOString(),
        endAt: new Date(2026, 9, 12, 9, 3).toISOString(),
      });

      expect(eventToDayTask(event).time).toBe('05:07 – 09:03');
    });

    it('работает с полночью и концом дня', () => {
      const event = makeEvent({
        startAt: new Date(2026, 9, 12, 0, 0).toISOString(),
        endAt: new Date(2026, 9, 12, 23, 59).toISOString(),
      });

      expect(eventToDayTask(event).time).toBe('00:00 – 23:59');
    });

    it('использует локальное время, а не UTC', () => {
      const localStart = new Date(2026, 9, 12, 14, 0);
      const localEnd = new Date(2026, 9, 12, 14, 30);

      const event = makeEvent({
        startAt: localStart.toISOString(),
        endAt: localEnd.toISOString(),
      });

      expect(eventToDayTask(event).time).toBe('14:00 – 14:30');
    });
  });

  describe('projectName', () => {
    it('использует переданное projectName', () => {
      expect(eventToDayTask(makeEvent(), 'Продукт').projectName).toBe('Продукт');
    });

    it('без аргумента возвращает "Без проекта"', () => {
      expect(eventToDayTask(makeEvent()).projectName).toBe('Без проекта');
    });

    it('сохраняет пустую строку, если она передана явно', () => {
      expect(eventToDayTask(makeEvent(), '').projectName).toBe('');
    });
  });

  describe('иммутабельность', () => {
    it('не мутирует event', () => {
      const event = makeEvent();
      const before = JSON.stringify(event);

      eventToDayTask(event, 'Проект');

      expect(JSON.stringify(event)).toBe(before);
    });

    it('возвращает новый объект при каждом вызове', () => {
      const event = makeEvent();
      const a = eventToDayTask(event);
      const b = eventToDayTask(event);

      expect(a).not.toBe(b);
    });
  });

  describe('граничные случаи', () => {
    it('событие с пустым title', () => {
      const event = makeEvent({ title: '' });
      expect(eventToDayTask(event).label).toBe('');
    });

    it('событие с очень длинным title не обрезается', () => {
      const longTitle = 'A'.repeat(500);
      const event = makeEvent({ title: longTitle });

      expect(eventToDayTask(event).label).toBe(longTitle);
    });
  });
});
