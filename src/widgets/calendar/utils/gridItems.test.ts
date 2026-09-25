import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMonthGridItems } from './gridItems';

afterEach(() => {
  vi.useRealTimers();
});

describe('getMonthGridItems', () => {
  it('строит текущий месяц и отмечает сегодня без фиксированных данных', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 21, 12));

    const cells = getMonthGridItems();

    expect(cells).toHaveLength(35);
    expect(cells[0].date).toBe('2026-08-30');
    expect(cells.at(-1)?.date).toBe('2026-10-03');
    expect(cells.filter((cell) => cell.isCurrentMonth)).toHaveLength(30);
    expect(cells.filter((cell) => cell.isToday)).toEqual([
      {
        date: '2026-09-21',
        day: 21,
        isCurrentMonth: true,
        isToday: true,
        isWeekend: false,
      },
    ]);
  });

  it('учитывает 29 февраля только в високосном году', () => {
    const leapFebruary = getMonthGridItems(new Date(2024, 1, 10));
    const regularFebruary = getMonthGridItems(new Date(2025, 1, 10));

    expect(leapFebruary.filter((cell) => cell.isCurrentMonth)).toHaveLength(29);
    expect(leapFebruary.find((cell) => cell.date === '2024-02-29')?.isCurrentMonth).toBe(true);
    expect(regularFebruary.filter((cell) => cell.isCurrentMonth)).toHaveLength(28);
    expect(regularFebruary.some((cell) => cell.date === '2025-02-29')).toBe(false);
  });

  it('оставляет четыре недели, если месяц полностью в них помещается', () => {
    const cells = getMonthGridItems(new Date(2026, 1, 1));

    expect(cells).toHaveLength(28);
    expect(cells[0].date).toBe('2026-02-01');
    expect(cells.at(-1)?.date).toBe('2026-02-28');
    expect(cells.every((cell) => cell.isCurrentMonth)).toBe(true);
  });

  it('добавляет шестую неделю, когда она нужна для последних дней месяца', () => {
    const cells = getMonthGridItems(new Date(2026, 4, 1));

    expect(cells).toHaveLength(42);
    expect(cells[0].date).toBe('2026-04-26');
    expect(cells.at(-1)?.date).toBe('2026-06-06');
    expect(cells.filter((cell) => cell.isCurrentMonth)).toHaveLength(31);
  });

  it('заполняет соседние недели на границе года и не изменяет входные даты', () => {
    const month = new Date(2027, 0, 15, 18);
    const today = new Date(2026, 11, 31, 23, 30);
    const originalMonth = month.getTime();
    const originalToday = today.getTime();
    const cells = getMonthGridItems(month, today);

    expect(cells[0].date).toBe('2026-12-27');
    expect(cells.at(-1)?.date).toBe('2027-02-06');
    expect(cells.filter((cell) => cell.isCurrentMonth)).toHaveLength(31);
    expect(cells.find((cell) => cell.isToday)).toMatchObject({
      date: '2026-12-31',
      isCurrentMonth: false,
    });
    expect(month.getTime()).toBe(originalMonth);
    expect(today.getTime()).toBe(originalToday);
  });

  it('отмечает выходными только воскресенье и субботу в каждой неделе', () => {
    const cells = getMonthGridItems(new Date(2026, 2, 1));

    expect(new Set(cells.map((cell) => cell.date)).size).toBe(cells.length);
    expect(cells.filter((cell) => cell.isCurrentMonth).map((cell) => cell.day)).toEqual(
      Array.from({ length: 31 }, (_, index) => index + 1),
    );
    cells.forEach((cell, index) => {
      expect(cell.isWeekend).toBe(index % 7 === 0 || index % 7 === 6);
    });
  });
});
