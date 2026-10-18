import { describe, expect, it } from 'vitest';
import { getTiptapText } from './getTiptapText';

describe('getTiptapText', () => {
  it('собирает текст с форматированием и разделяет абзацы', () => {
    expect(
      getTiptapText({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Привет, ' },
              { type: 'text', text: 'мир', marks: [{ type: 'bold' }] },
              { type: 'hardBreak' },
              { type: 'text', text: 'Следующая строка' },
            ],
          },
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Заголовок' }] },
        ],
      }),
    ).toBe('Привет, мир\nСледующая строка\nЗаголовок');
  });

  it('не считает URL и атрибуты частью текста статьи', () => {
    const text = getTiptapText({
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/' + 'a'.repeat(2000), alt: 'Обложка' },
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Ссылка',
              marks: [{ type: 'link', attrs: { href: 'https://example.com/' + 'b'.repeat(2000) } }],
            },
          ],
        },
      ],
    });
    expect(text.trim()).toBe('Ссылка');
  });

  it('проходит по вложенным спискам и неизвестным контейнерам', () => {
    expect(
      getTiptapText({
        type: 'customContainer',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Пункт' }] }],
              },
            ],
          },
        ],
      }),
    ).toBe('Пункт');
  });

  it('принимает пустой документ', () => {
    expect(getTiptapText({ type: 'doc', content: [] })).toBe('');
  });
});
