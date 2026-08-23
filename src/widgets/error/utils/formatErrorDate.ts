export const formatErrorDate = (date: Date) => {
  const parts = date.toUTCString().split(' ');
  const dateStr = parts.slice(0, 4).join(' ');
  const time = parts[4];
  return `${dateStr} · ${time} UTC`;
};
