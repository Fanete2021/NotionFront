import { describe, expect, it } from 'vitest';
import { pad, toDateKey, toIsoRange, toTimeKey } from './dateKeys';

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
    const d = new Date(2026, 8, 9); // 9 сентября 2026, локальная
    expect(toDateKey(d)).toBe('2026-09-09');
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
    const d = new Date(2026, 8, 9, 0, 30);
    expect(toDateKey(d)).toBe('2026-09-09');
  });
});

describe('toTimeKey', () => {
  it('возвращает HH:mm для ISO-строки в локальном поясе', () => {
    const iso = new Date(2026, 8, 9, 14, 30).toISOString();
    expect(toTimeKey(iso)).toBe('14:30');
  });

  it('добивает нулями часы и минуты', () => {
    const iso = new Date(2026, 8, 9, 5, 7).toISOString();
    expect(toTimeKey(iso)).toBe('05:07');
  });

  it('обрабатывает полночь', () => {
    const iso = new Date(2026, 8, 9, 0, 0).toISOString();
    expect(toTimeKey(iso)).toBe('00:00');
  });

  it('обрабатывает конец дня', () => {
    const iso = new Date(2026, 8, 9, 23, 59).toISOString();
    expect(toTimeKey(iso)).toBe('23:59');
  });
});

describe('toIsoRange', () => {
  it('собирает startAt и endAt из локальной даты и времени', () => {
    const date = new Date(2026, 8, 9);
    const { startAt, endAt } = toIsoRange(date, '14:00', '14:30');

    const start = new Date(startAt);
    const end = new Date(endAt);
    expect(end.getTime() - start.getTime()).toBe(30 * 60 * 1000);
  });

  it('сохраняет локальные часы (не сдвигает на UTC)', () => {
    const date = new Date(2026, 8, 9);
    const { startAt } = toIsoRange(date, '14:00', '14:30');
    const d = new Date(startAt);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(0);
    expect(d.getDate()).toBe(9);
    expect(d.getMonth()).toBe(8);
    expect(d.getFullYear()).toBe(2026);
  });

  it('корректно работает, если дата передана как UTC-полночь', () => {
    const date = new Date('2026-09-09T00:00:00.000Z');
    const { startAt } = toIsoRange(date, '14:00', '14:30');
    const d = new Date(startAt);

    expect(d.getFullYear()).toBe(date.getFullYear());
    expect(d.getMonth()).toBe(date.getMonth());
    expect(d.getDate()).toBe(date.getDate());
    expect(d.getHours()).toBe(14);
  });

  it('передаёт endAt корректно', () => {
    const date = new Date(2026, 8, 9);
    const { endAt } = toIsoRange(date, '14:00', '16:45');
    const d = new Date(endAt);
    expect(d.getHours()).toBe(16);
    expect(d.getMinutes()).toBe(45);
  });

  it('кидает ошибку на невалидном времени (NaN Date)', () => {
    const date = new Date(2026, 8, 9);
    const { startAt } = toIsoRange(date, 'abc', '14:30');
    expect(Number.isNaN(new Date(startAt).getTime())).toBe(true);
  });
});
