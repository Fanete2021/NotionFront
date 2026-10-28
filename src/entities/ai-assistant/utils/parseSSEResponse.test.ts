import { describe, expect, it } from 'vitest';
import type { AiSSEEvent } from '../model/ai-assistant.types';
import { parseSSEResponse } from './parseSSEResponse';

describe('parseSSEResponse', () => {
  it('сохраняет код серверной ошибки внутри SSE-события', () => {
    expect(
      parseSSEResponse(
        'event: error\ndata: {"status":"error","message":"Provider timeout","statusCode":504}\n\n',
      ).events,
    ).toEqual([
      { status: 'error', data: { status: 'error', message: 'Provider timeout', statusCode: 504 } },
    ]);
  });
  it('обрабатывает полное событие и сохраняет следующее до пустой строки', () => {
    const pending = 'event: delta\ndata: {"text":"ивет"}';
    const first = parseSSEResponse('event: delta\ndata: {"text":"Пр"}\n\n' + pending);

    expect(first).toEqual({
      events: [{ status: 'delta', data: { text: 'Пр' } }],
      buffer: pending,
    });
    expect(parseSSEResponse('\n', first.buffer)).toEqual({
      events: [],
      buffer: pending + '\n',
    });
    expect(parseSSEResponse('\n\n', first.buffer)).toEqual({
      events: [{ status: 'delta', data: { text: 'ивет' } }],
      buffer: '',
    });
  });

  it.each(['\n', '\r\n'])('сохраняет все события при любом месте разрыва чанка (%j)', (newline) => {
    const expected: AiSSEEvent[] = [
      { status: 'status', data: { status: 'waiting' } },
      { status: 'delta', data: { text: ' Привет\n' } },
      { status: 'done', data: { action: 'write', status: 'done', text: ' Привет\n' } },
      { status: 'error', data: { status: 'error', message: 'Ошибка генерации' } },
    ];
    const stream = expected
      .map(
        ({ status, data }) =>
          `event: ${status}${newline}data: ${JSON.stringify(data)}${newline}${newline}`,
      )
      .join('');

    for (let index = 0; index <= stream.length; index++) {
      const first = parseSSEResponse(stream.slice(0, index));
      const second = parseSSEResponse(stream.slice(index), first.buffer);

      expect([...first.events, ...second.events]).toEqual(expected);
      expect(second.buffer).toBe('');
    }
  });

  it('поддерживает последовательную передачу по одному символу', () => {
    const stream = 'event: delta\r\ndata: {"text":"Привет"}\r\n\r\n';
    const events: AiSSEEvent[] = [];
    let buffer = '';

    for (const chunk of stream) {
      const parsed = parseSSEResponse(chunk, buffer);
      buffer = parsed.buffer;
      events.push(...parsed.events);
    }

    expect(events).toEqual([{ status: 'delta', data: { text: 'Привет' } }]);
    expect(buffer).toBe('');
  });

  it('объединяет несколько полей data и сохраняет пробелы внутри text', () => {
    const parsed = parseSSEResponse('event:delta\ndata: {\ndata: "text": "  Привет\\n "}\n\n');

    expect(parsed.events).toEqual([{ status: 'delta', data: { text: '  Привет\n ' } }]);
  });

  it('пропускает комментарии, служебные поля и неизвестные события', () => {
    const parsed = parseSSEResponse(
      ': heartbeat\n\n' +
        'event: unknown\ndata: not json\n\n' +
        'event: delta\n\n' +
        ': comment\nid: 1\nretry: 1000\nevent: delta\ndata: {"text":""}\n\n',
    );

    expect(parsed).toEqual({ events: [{ status: 'delta', data: { text: '' } }], buffer: '' });
  });

  it.each([
    'event: delta\ndata: not json\n\n',
    'event: delta\ndata: {"text":42}\n\n',
    'event: status\ndata: {"text":"waiting"}\n\n',
    'event: done\ndata: {"action":"unknown","status":"done","text":"result"}\n\n',
    'event: error\ndata: {"status":"error"}\n\n',
  ])('отклоняет некорректные данные известного события: %s', (chunk) => {
    expect(() => parseSSEResponse(chunk)).toThrow();
  });
});
