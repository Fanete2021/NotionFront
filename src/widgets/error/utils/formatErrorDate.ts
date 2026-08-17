export const formatErrorDate = (date: Date) => {
  const utcString = date.toUTCString();

  const [day, time] = utcString.split('T');

  return `${day} · ${time.slice(0, 8)} UTC`;
};
