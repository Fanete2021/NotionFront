import { describe, it, expect } from 'vitest';
import { formatBytes } from '@features/text-editor/utils/formatBytes';

describe('formatBytes', () => {
  it('должна корректно конвертировать байты в КБ, МБ и ГБ', () => {
    expect(formatBytes(1024, 'KB')).toBe(1);
    expect(formatBytes(1048576, 'MB')).toBe(1); // 1024 ** 2
    expect(formatBytes(1073741824, 'GB')).toBe(1); // 1024 ** 3
  });

  it('должна возвращать 0 при передаче 0 байт', () => {
    expect(formatBytes(0, 'KB')).toBe(0);
    expect(formatBytes(0, 'MB')).toBe(0);
    expect(formatBytes(0, 'GB')).toBe(0);
  });

  it('должна корректно возвращать дробные значения', () => {
    expect(formatBytes(512, 'KB')).toBe(0.5);
    expect(formatBytes(1572864, 'MB')).toBe(1.5); // 1.5 МБ в байтах
  });

  it('должна корректно обрабатывать большие объемы данных', () => {
    expect(formatBytes(10240, 'KB')).toBe(10);
    expect(formatBytes(5368709120, 'GB')).toBe(5);
  });
});
