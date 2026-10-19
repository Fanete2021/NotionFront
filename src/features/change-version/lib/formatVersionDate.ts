const DAY = 24 * 60 * 60 * 1000;

const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });

const dayWithYearFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const fullDayFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const formatTime = (date: Date) =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

export function formatVersionDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '—';

  const now = new Date();
  const time = formatTime(date);
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / DAY);

  if (daysAgo === 0) return `Сегодня, ${time}`;
  if (daysAgo === 1) return `Вчера, ${time}`;

  const formatter = date.getFullYear() === now.getFullYear() ? dayFormatter : dayWithYearFormatter;

  return `${formatter.format(date)}, ${time}`;
}

export function formatVersionFullDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '—';

  return `${fullDayFormatter.format(date)}, ${formatTime(date)}`;
}
