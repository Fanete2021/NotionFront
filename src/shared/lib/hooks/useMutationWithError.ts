import { useState, useCallback, useRef } from 'react';
import { processMutationError } from '@/shared/utils/error-utils';
import { FieldErrorMap } from '../../utils/error-utils/errorUtils';

type MutationOptions<T = unknown> = {
  onSuccess?: (data: T) => void;
  fieldMap?: FieldErrorMap;
};

type UseMutationWithErrorReturn<T, Args> = {
  execute: (args: Args) => Promise<T>;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  hasError: boolean;
  resetError: () => void;
  abort: () => void;
};

export function useMutationWithError<T = unknown, Args = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Используем any, чтобы не переопределять сложные типы RTK Query
  mutationHook: any,
  options: MutationOptions<T> = {},
): UseMutationWithErrorReturn<T, Args> {
  const [mutate, { isLoading, reset }] = mutationHook();
  const requestRef = useRef<{ abort?: () => void } | null>(null);
  const [error, setError] = useState<{
    message: string | null;
    fieldErrors: Record<string, string>;
  }>({
    message: null,
    fieldErrors: {},
  });

  const execute = useCallback(
    async (args: Args): Promise<T> => {
      setError({ message: null, fieldErrors: {} });
      let request: { abort?: () => void } | null = null;

      try {
        const pending = mutate(args);
        request = pending;
        requestRef.current = request;
        const result = await pending.unwrap();
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const processed = processMutationError(err, options.fieldMap);
        setError({
          message: processed.message,
          fieldErrors: processed.fieldErrors,
        });

        return Promise.reject(err);
      } finally {
        if (requestRef.current === request) requestRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutate, options.onSuccess, options.fieldMap],
  );

  const resetError = useCallback(() => {
    setError({ message: null, fieldErrors: {} });
    reset?.();
  }, [reset]);

  const abort = useCallback(() => {
    requestRef.current?.abort?.();
  }, []);

  return {
    execute,
    isLoading,
    error: error.message,
    fieldErrors: error.fieldErrors,
    hasError: !!error.message || Object.keys(error.fieldErrors).length > 0,
    resetError,
    abort,
  };
}
