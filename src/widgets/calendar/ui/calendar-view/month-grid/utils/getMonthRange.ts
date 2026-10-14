import { getMonthGridItems } from '../../../../utils/gridItems';

/** Возвращает ISO-строку начала месяца (00:00:00.000 первого дня). */
export const getMonthStart = (month: Date): string => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  return new Date(year, monthIndex, 1, 0, 0, 0, 0).toISOString();
};

/**
 * Возвращает ISO-строку конца месяца (23:59:59.999 последнего дня).
 * Конструктор Date с day=0 даёт последний день предыдущего месяца,
 * а мы передаём month + 1 — это и есть последний день текущего месяца.
 */
export const getMonthEnd = (month: Date): string => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0);
  return new Date(year, monthIndex, lastDay.getDate(), 23, 59, 59, 999).toISOString();
};

/** Возвращает { from, to } для месяца — границы для запроса событий. */
export const getMonthRange = (month: Date): { from: string; to: string } => ({
  from: getMonthStart(month),
  to: getMonthEnd(month),
});

/** Диапазон для запроса событий: от начала первой ячейки сетки до конца последней. */
export const getMonthGridRange = (month: Date): { from: string; to: string } => {
  const items = getMonthGridItems(month);
  if (items.length === 0) return { from: '', to: '' };

  const first = items[0].date;
  const last = items[items.length - 1].date;

  return {
    from: new Date(`${first}T00:00:00`).toISOString(),
    to: new Date(`${last}T23:59:59.999`).toISOString(),
  };
};
