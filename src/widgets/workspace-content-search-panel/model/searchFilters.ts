export interface SearchDateRange {
  from: string;
  to: string;
}

export const getSearchDateRange = (
  dateId: string | null,
  now = new Date(),
): SearchDateRange | undefined => {
  if (dateId !== 'today' && dateId !== 'week') return undefined;

  const from = new Date(now);
  from.setHours(0, 0, 0, 0);

  if (dateId === 'week') {
    from.setDate(from.getDate() - ((from.getDay() + 6) % 7));
  }

  const to = new Date(now);
  to.setHours(23, 59, 59, 999);

  return { from: from.toISOString(), to: to.toISOString() };
};

export const filterPagesByDate = <T extends { updatedAt: string }>(
  pages: T[],
  range: SearchDateRange | undefined,
): T[] => {
  if (!range) return pages;

  const from = new Date(range.from).getTime();
  const to = new Date(range.to).getTime();

  return pages.filter(({ updatedAt }) => {
    const updated = new Date(updatedAt).getTime();
    return updated >= from && updated <= to;
  });
};
