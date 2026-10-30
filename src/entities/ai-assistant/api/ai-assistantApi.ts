import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { GenerateAiArgs } from '../model/ai-assistant.types';
import { parseSSEResponse } from '../utils/parseSSEResponse';
import { baseApi } from '@shared/api';
import { isFetchBaseQueryError } from '@shared/utils/error-utils/errorUtils';

export const aiAssistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAiQuery: builder.mutation<string, GenerateAiArgs>({
      async queryFn({ body, onEvent }, api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: 'ai/complete',
          headers: {
            Accept: 'text/event-stream',
          },
          method: 'POST',
          body,
          responseHandler: async (response): Promise<string | FetchBaseQueryError> => {
            if (!response.ok) return response.text();

            if (!response.body) {
              throw new Error('Сервер не вернул поток');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let sseBuffer = '';
            let resultText = '';

            try {
              while (true) {
                const { value, done } = await reader.read();
                const chunk = decoder.decode(value, { stream: !done });
                const parsed = parseSSEResponse(chunk, sseBuffer);
                sseBuffer = parsed.buffer;

                for (const event of parsed.events) {
                  if (api.signal.aborted) {
                    return { status: 'CUSTOM_ERROR', error: 'Генерация остановлена' };
                  }
                  onEvent?.(event);
                  switch (event.status) {
                    case 'status':
                      // Ожидание уже отражается через isLoading мутации.
                      break;
                    case 'delta':
                      resultText += event.data.text;
                      break;
                    case 'done':
                      resultText = event.data.text;
                      return resultText;
                    case 'error':
                      return {
                        status: 'CUSTOM_ERROR',
                        error: event.data.message,
                        data: event.data,
                      };
                  }
                }

                if (done) {
                  return {
                    status: 'CUSTOM_ERROR',
                    error: 'Поток ИИ завершился без события done',
                  };
                }
              }
            } finally {
              // Ошибка отмены не должна подменять исходный результат чтения.
              await reader.cancel().catch(() => undefined);
              reader.releaseLock();
            }
          },
        });
        if (result.error) return { error: result.error };
        if (isFetchBaseQueryError(result.data)) return { error: result.data };

        if (typeof result.data !== 'string') {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Ожидался текстовый ответ SSE',
            },
          };
        }

        return { data: result.data };
      },
      extraOptions: { requiresAuth: true },
    }),
  }),
});

export const { useGenerateAiQueryMutation } = aiAssistantApi;
