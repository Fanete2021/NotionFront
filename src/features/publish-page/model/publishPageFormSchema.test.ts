import { describe, expect, it } from 'vitest';
import { publishPageFormSchema } from './publishPageFormSchema';

const validValues = {
  title: 'Дизайн-система — Компоненты',
  description: 'Основные UI-компоненты продукта.',
};

describe('publishPageFormSchema', () => {
  it('убирает внешние пробелы, сохраняя пробелы в тексте', () => {
    expect(
      publishPageFormSchema.parse({
        ...validValues,
        title: '  Дизайн-система — Компоненты  ',
        description: '  Основные UI-компоненты продукта.  ',
      }),
    ).toEqual(validValues);
  });

  it('позволяет оставить мета-описание пустым', () => {
    expect(publishPageFormSchema.safeParse({ ...validValues, description: '' }).success).toBe(true);
  });

  it.each(['', '   '])('отклоняет пустой заголовок: %j', (title) => {
    expect(publishPageFormSchema.safeParse({ ...validValues, title }).success).toBe(false);
  });

  it.each([
    ['title', 120],
    ['description', 160],
  ] as const)('проверяет ограничение длины %s', (field, limit) => {
    expect(
      publishPageFormSchema.safeParse({ ...validValues, [field]: 'a'.repeat(limit) }).success,
    ).toBe(true);
    expect(
      publishPageFormSchema.safeParse({ ...validValues, [field]: 'a'.repeat(limit + 1) }).success,
    ).toBe(false);
  });
});
