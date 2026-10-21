export const getSafeUrl = (value: unknown, media = false): string | undefined => {
  if (typeof value !== 'string' || !value.trim()) return undefined;

  try {
    const url = new URL(value, 'https://article.local');
    const protocols = media ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:', 'tel:'];
    return protocols.includes(url.protocol) ? value.trim() : undefined;
  } catch {
    return undefined;
  }
};
