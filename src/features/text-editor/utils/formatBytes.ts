type DataUnit = 'KB' | 'MB' | 'GB';

export function formatBytes(bytes: number, to: DataUnit) {
  const sizes: Record<DataUnit, number> = {
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };

  return bytes / sizes[to];
}
