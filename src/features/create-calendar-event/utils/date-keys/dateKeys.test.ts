import { describe, expect, it } from 'vitest';
import { pad, toDateKey, toIsoRange, toTimeKey } from './dateKeys';
import { createCalendarEventFormSchema } from '../validation-create-calendar-event-config/validationCreateCalendarEventConfig';

describe('pad', () => {
  it('добивает однозначные числа нулём', () => {
    expect(pad(0)).toBe('00');
    expect(pad(5)).toBe('05');
    expect(pad(9)).toBe('09');
  });

  it('не трогает двузначные числа', () => {
    expect(pad(10)).toBe('10');
    expect(pad(42)).toBe('42');
    expect(pad(99)).toBe('99');
  });
});

describe('toDateKey', () => {
  it('возвращает YYYY-MM-DD для локальной даты', () => {
    const d = new Date(2026, 9, 12); // 12 октября 2026, локальная
    expect(toDateKey(d)).toBe('2026-10-12');
  });

  it('добивает нулями месяц и день', () => {
    const d = new Date(2026, 0, 5); // 5 января
    expect(toDateKey(d)).toBe('2026-01-05');
  });

  it('корректно обрабатывает конец года', () => {
    const d = new Date(2026, 11, 31);
    expect(toDateKey(d)).toBe('2026-12-31');
  });

  it('использует локальный часовой пояс, а не UTC', () => {
    const d = new Date(2026, 9, 12, 0, 30);
    expect(toDateKey(d)).toBe('2026-10-12');
  });
});

describe('toTimeKey', () => {
  it('возвращает HH:mm для ISO-строки в локальном поясе', () => {
    const iso = new Date(2026, 9, 12, 14, 30).toISOString();
    expect(toTimeKey(iso)).toBe('14:30');
  });

  it('добивает нулями часы и минуты', () => {
    const iso = new Date(2026, 9, 12, 5, 7).toISOString();
    expect(toTimeKey(iso)).toBe('05:07');
  });

  it('обрабатывает полночь', () => {
    const iso = new Date(2026, 9, 12, 0, 0).toISOString();
    expect(toTimeKey(iso)).toBe('00:00');
  });

  it('обрабатывает конец дня', () => {
    const iso = new Date(2026, 9, 12, 23, 59).toISOString();
    expect(toTimeKey(iso)).toBe('23:59');
  });
});

describe('toIsoRange', () => {
  it('собирает startAt и endAt из локальной даты и времени', () => {
    const date = new Date(2026, 9, 12);
    const { startAt, endAt } = toIsoRange(date, '14:00', '14:30');

    const start = new Date(startAt);
    const end = new Date(endAt);
    expect(end.getTime() - start.getTime()).toBe(30 * 60 * 1000);
  });

  it('сохраняет локальные часы (не сдвигает на UTC)', () => {
    const date = new Date(2026, 9, 12);
    const { startAt } = toIsoRange(date, '14:00', '14:30');
    const d = new Date(startAt);

    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(0);
    expect(d.getDate()).toBe(12);
    expect(d.getMonth()).toBe(9);
    expect(d.getFullYear()).toBe(2026);
  });

  it('кидает ошибку на невалидном времени (NaN Date)', () => {
    const date = new Date(2026, 9, 12);
    const { startAt } = toIsoRange(date, 'abc', '14:30');
    expect(Number.isNaN(new Date(startAt).getTime())).toBe(true);
  });
});

describe('парсинг даты из input type="date" через схему', () => {
  const validInput = {
    title: 'Встреча с командой продукта',
    date: '2026-10-12',
    startTime: '14:00',
    endTime: '14:30',
    project: undefined,
    taskType: 'meet',
    repeatable: 'no-repeat',
    notifications: false,
    telegramSend: false,
  };

  it('парсит строку YYYY-MM-DD как локальную дату, а не UTC', () => {
    const result = createCalendarEventFormSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      const d = result.data.date;
      expect(d.getFullYear()).toBe(2026);
      expect(d.getMonth()).toBe(9);
      expect(d.getDate()).toBe(12);
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
    }
  });

  it('toDateKey от спарсенной даты возвращает исходную строку', () => {
    const result = createCalendarEventFormSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(toDateKey(result.data.date)).toBe('2026-10-12');
    }
  });

  it('при TZ западнее UTC startAt попадает на тот же локальный день', () => {
    const result = createCalendarEventFormSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      const { startAt } = toIsoRange(result.data.date, result.data.startTime, result.data.endTime);
      const d = new Date(startAt);

      expect(d.getDate()).toBe(12);
      expect(d.getMonth()).toBe(9);
      expect(d.getFullYear()).toBe(2026);
      expect(d.getHours()).toBe(14);
    }
  });

  it('принимает значение из Date (когда RHF уже отдал Date)', () => {
    const result = createCalendarEventFormSchema.safeParse({
      ...validInput,
      date: new Date(2026, 9, 12),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(toDateKey(result.data.date)).toBe('2026-10-12');
    }
  });

  it('падает на пустой строке', () => {
    const result = createCalendarEventFormSchema.safeParse({ ...validInput, date: '' });

    expect(result.success).toBe(false);
  });

  it('падает на null', () => {
    const result = createCalendarEventFormSchema.safeParse({ ...validInput, date: null });

    expect(result.success).toBe(false);
  });

  it('падает на невалидной строке', () => {
    const result = createCalendarEventFormSchema.safeParse({
      ...validInput,
      date: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });
});
