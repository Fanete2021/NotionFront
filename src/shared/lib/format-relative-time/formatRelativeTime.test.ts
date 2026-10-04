import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime';

const MOCK_DATE = new Date('2026-06-15T12:00:00.000Z');

const minutesAgo = (count: number) => new Date(MOCK_DATE.getTime() - count * 60_000).toISOString();
const hoursAgo = (count: number) => minutesAgo(count * 60);
const daysAgo = (count: number) => hoursAgo(count * 24);

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('должна показывать «только что» для свежих правок', () => {
    expect(formatRelativeTime(MOCK_DATE.toISOString())).toBe('только что');
    expect(formatRelativeTime(minutesAgo(0.5))).toBe('только что');
  });

  it('должна склонять минуты', () => {
    expect(formatRelativeTime(minutesAgo(1))).toBe('1 минуту назад');
    expect(formatRelativeTime(minutesAgo(3))).toBe('3 минуты назад');
    expect(formatRelativeTime(minutesAgo(5))).toBe('5 минут назад');
    expect(formatRelativeTime(minutesAgo(11))).toBe('11 минут назад');
    expect(formatRelativeTime(minutesAgo(21))).toBe('21 минуту назад');
  });

  it('должна склонять часы', () => {
    expect(formatRelativeTime(hoursAgo(1))).toBe('1 час назад');
    expect(formatRelativeTime(hoursAgo(2))).toBe('2 часа назад');
    expect(formatRelativeTime(hoursAgo(5))).toBe('5 часов назад');
    expect(formatRelativeTime(hoursAgo(11))).toBe('11 часов назад');
  });

  it('должна склонять дни', () => {
    expect(formatRelativeTime(daysAgo(1))).toBe('1 день назад');
    expect(formatRelativeTime(daysAgo(2))).toBe('2 дня назад');
    expect(formatRelativeTime(daysAgo(5))).toBe('5 дней назад');
  });

  it('должна показывать обычную дату для правок старше недели', () => {
    expect(formatRelativeTime(daysAgo(7))).toBe('8 июня 2026 г.');
    expect(formatRelativeTime('2020-01-03T00:00:00.000Z')).toBe('3 января 2020 г.');
  });

  it('должна показывать «только что» для некорректной даты', () => {
    expect(formatRelativeTime('не дата')).toBe('только что');
  });
});
