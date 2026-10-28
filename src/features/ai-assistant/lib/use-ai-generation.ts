'use client';

import { useEffect, useRef, useState } from 'react';
import type { AiGenerationError, AiResultStatus } from '../model/ai-types';
import { getAiGenerationError } from '../utils/getAiGenerationError';
import {
  type CompleteAiDTO,
  type GenerateAiArgs,
  useGenerateAiQueryMutation,
} from '@entities/ai-assistant';
import { useMutationWithError } from '@shared/lib';
import { HTTP_STATUS } from '@shared/const/httpStatus';

export function useAiGeneration() {
  const [resultText, setResultText] = useState('');
  const [status, setStatus] = useState<AiResultStatus>('idle');
  const [error, setError] = useState<AiGenerationError | null>(null);
  const lastRequest = useRef<CompleteAiDTO | null>(null);
  const requestVersion = useRef(0);
  const isPending = useRef(false);
  const { execute, isLoading, fieldErrors, abort, resetError } = useMutationWithError<
    string,
    GenerateAiArgs
  >(useGenerateAiQueryMutation, {
    fieldMap: {
      [HTTP_STATUS.UNPROCESSABLE_ENTITY]: {
        field: 'prompt',
        message: 'Проверьте текст запроса и его длину',
      },
    },
  });

  useEffect(
    () => () => {
      requestVersion.current++;
      abort();
    },
    [abort],
  );

  const generate = async (body: CompleteAiDTO) => {
    if (isPending.current) return;

    const version = ++requestVersion.current;
    isPending.current = true;
    lastRequest.current = body;
    setResultText('');
    setStatus('idle');
    setError(null);

    try {
      const text = await execute({
        body,
        onEvent: (event) => {
          if (version !== requestVersion.current) return;
          if (event.status === 'delta') {
            setStatus('streaming');
            setResultText((previous) => previous + event.data.text);
          }
          if (event.status === 'done') setResultText(event.data.text);
        },
      });
      if (version !== requestVersion.current) return;
      setResultText(text);
      setStatus('done');
    } catch (cause) {
      if (version !== requestVersion.current) return;
      setError(getAiGenerationError(cause));
      setStatus('error');
    } finally {
      if (version === requestVersion.current) isPending.current = false;
    }
  };

  const stop = () => {
    requestVersion.current++;
    isPending.current = false;
    abort();
    setStatus('stopped');
  };

  const reset = () => {
    requestVersion.current++;
    isPending.current = false;
    abort();
    resetError();
    setResultText('');
    setStatus('idle');
    setError(null);
  };

  return {
    resultText,
    status,
    error,
    fieldErrors,
    isLoading,
    generate,
    stop,
    reset,
    regenerate: () => {
      if (lastRequest.current) void generate(lastRequest.current);
    },
  };
}
