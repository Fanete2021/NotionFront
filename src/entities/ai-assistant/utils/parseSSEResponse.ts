import { z } from 'zod';
import type { AiSSEEvent } from '../model/ai-assistant.types';

const aiSSEEventSchema: z.ZodType<AiSSEEvent> = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('status'),
    data: z.object({ status: z.literal('waiting') }),
  }),
  z.object({
    status: z.literal('delta'),
    data: z.object({ text: z.string() }),
  }),
  z.object({
    status: z.literal('done'),
    data: z.object({
      action: z.enum(['write', 'improve', 'summarize', 'fix_grammar', 'translate']),
      status: z.literal('done'),
      text: z.string(),
    }),
  }),
  z.object({
    status: z.literal('error'),
    data: z.object({
      status: z.literal('error'),
      message: z.string(),
      statusCode: z.number().int().optional(),
    }),
  }),
]);

/**
 * Разбирает завершённые SSE-события с переносами LF или CRLF.
 * Передавай возвращённый buffer вместе со следующим декодированным chunk.
 * Некорректный JSON или данные известного события вызывают ошибку.
 */
export function parseSSEResponse(
  chunk: string,
  buffer = '',
): { events: AiSSEEvent[]; buffer: string } {
  const text = buffer + chunk;
  const events: AiSSEEvent[] = [];
  const separator = /\r?\n\r?\n/g;
  let eventStart = 0;
  let match: RegExpExecArray | null;

  while ((match = separator.exec(text)) !== null) {
    const block = text.slice(eventStart, match.index);
    eventStart = separator.lastIndex;

    let status = 'message';
    const dataLines: string[] = [];

    for (const line of block.split(/\r?\n/)) {
      // Комментарии SSE (в том числе heartbeat) не содержат данных события.
      if (line.startsWith(':')) continue;

      const colonIndex = line.indexOf(':');
      const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
      const rawValue = colonIndex === -1 ? '' : line.slice(colonIndex + 1);
      const value = rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;

      if (field === 'event') status = value;
      if (field === 'data') dataLines.push(value);
    }

    if (!dataLines.length || !['status', 'delta', 'done', 'error'].includes(status)) continue;

    const data: unknown = JSON.parse(dataLines.join('\n'));
    events.push(aiSSEEventSchema.parse({ status, data }));
  }

  return { events, buffer: text.slice(eventStart) };
}
