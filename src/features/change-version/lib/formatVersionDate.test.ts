import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatVersionDate, formatVersionFullDate } from './formatVersionDate';

const MOCK_DATE = new Date(2026, 9, 12, 18, 0);

const localIso = (year: number, month: number, day: number, hours: number, minutes: number) =>
  new Date(year, month, day, hours, minutes).toISOString();

describe('formatVersionDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('должна подписывать сегодняшние версии словом «Сегодня»', () => {
    expect(formatVersionDate(localIso(2026, 9, 12, 14, 14))).toBe('Сегодня, 14:14');
    expect(formatVersionDate(localIso(2026, 9, 12, 0, 5))).toBe('Сегодня, 0:05');
  });

  it('должна подписывать вчерашние версии словом «Вчера»', () => {
    expect(formatVersionDate(localIso(2026, 9, 11, 23, 59))).toBe('Вчера, 23:59');
    expect(formatVersionDate(localIso(2026, 9, 11, 0, 0))).toBe('Вчера, 0:00');
  });

  it('должна показывать день и месяц для более старых версий этого года', () => {
    expect(formatVersionDate(localIso(2026, 9, 10, 16, 30))).toBe('10 окт., 16:30');
    expect(formatVersionDate(localIso(2026, 0, 12, 9, 0))).toBe('12 янв., 9:00');
  });

  it('должна добавлять год для версий прошлых лет', () => {
    expect(formatVersionDate(localIso(2025, 11, 31, 16, 30))).toBe('31 дек. 2025 г., 16:30');
  });

  it('должна возвращать прочерк для некорректной даты', () => {
    expect(formatVersionDate('не дата')).toBe('—');
  });
});

describe('formatVersionFullDate', () => {
  it('должна показывать полную дату со временем', () => {
    expect(formatVersionFullDate(localIso(2026, 9, 12, 14, 14))).toBe('12 октября 2026 г., 14:14');
  });

  it('должна возвращать прочерк для некорректной даты', () => {
    expect(formatVersionFullDate('не дата')).toBe('—');
  });
});
