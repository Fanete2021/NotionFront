import { describe, expect, it } from 'vitest';
import { publishPageFormSchema } from './publishPageFormSchema';

const validValues = {
  isPublic: true,
  title: 'Дизайн-система — Компоненты',
  description: 'Основные UI-компоненты продукта.',
  slug: 'design-system-components',
};

describe('publishPageFormSchema', () => {
  it('убирает внешние пробелы, сохраняя пробелы в тексте', () => {
    expect(
      publishPageFormSchema.parse({
        ...validValues,
        title: '  Дизайн-система — Компоненты  ',
        description: '  Основные UI-компоненты продукта.  ',
        slug: '  design-system-components  ',
      }),
    ).toEqual(validValues);
  });

  it('позволяет оставить мета-описание пустым', () => {
    expect(publishPageFormSchema.safeParse({ ...validValues, description: '' }).success).toBe(true);
  });

  it('принимает идентификатор страницы как начальный slug', () => {
    expect(
      publishPageFormSchema.safeParse({
        ...validValues,
        slug: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      }).success,
    ).toBe(true);
  });

  it.each(['', '   '])('отклоняет пустой заголовок: %j', (title) => {
    expect(publishPageFormSchema.safeParse({ ...validValues, title }).success).toBe(false);
  });

  it.each([
    '',
    ' ',
    '/page',
    '../page',
    'page/name',
    'Page',
    'страница',
    '-page',
    'page-',
    'page--name',
    'page name',
    'https://notify.ru/page',
  ])('отклоняет некорректный slug: %j', (slug) => {
    expect(publishPageFormSchema.safeParse({ ...validValues, slug }).success).toBe(false);
  });

  it.each([
    ['title', 120],
    ['description', 160],
    ['slug', 100],
  ] as const)('проверяет ограничение длины %s', (field, limit) => {
    expect(
      publishPageFormSchema.safeParse({ ...validValues, [field]: 'a'.repeat(limit) }).success,
    ).toBe(true);
    expect(
      publishPageFormSchema.safeParse({ ...validValues, [field]: 'a'.repeat(limit + 1) }).success,
    ).toBe(false);
  });
});
