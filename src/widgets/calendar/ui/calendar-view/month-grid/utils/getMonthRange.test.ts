import { describe, it, expect } from 'vitest';
import { getMonthRange, getMonthStart, getMonthEnd } from './getMonthRange';

describe('getMonthRange', () => {
  it('возвращает from = начало месяца, to = конец месяца', () => {
    const month = new Date(2026, 9, 15);
    const range = getMonthRange(month);
    expect(new Date(range.from).getDate()).toBe(1);
    expect(new Date(range.from).getMonth()).toBe(9);
    expect(new Date(range.to).getMonth()).toBe(9);
    expect(new Date(range.to).getDate()).toBe(31);
  });
});
