import { useState, useCallback } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { processMutationError } from '@/shared/utils/error-utils';

type MutationResult<T = unknown> = {
  data?: T;
  error?: FetchBaseQueryError | unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset?: () => void;
};

type MutationHook<T, Args> = () => readonly [
  (args: Args) => {
    unwrap: () => Promise<T>;
  },
  MutationResult<T>,
];

type MutationOptions<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: { message: string | null; fieldErrors: Record<string, string> }) => void;
  fieldMap?: Record<number, { field: string; message: string }>;
};

type UseMutationWithErrorReturn<T, Args> = {
  execute: (args: Args) => Promise<T>;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  hasError: boolean;
  resetError: () => void;
  data?: T;
  isSuccess: boolean;
};

export function useMutationWithError<T = unknown, Args = unknown>(
  mutationHook: MutationHook<T, Args>,
  options: MutationOptions<T> = {},
): UseMutationWithErrorReturn<T, Args> {
  const [mutate, { isLoading, data, isSuccess = false, error: mutationError, reset }] =
    mutationHook();
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

      try {
        const result = await mutate(args).unwrap();
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const processed = processMutationError(err, options.fieldMap);
        const errorState = {
          message: processed.message,
          fieldErrors: processed.fieldErrors,
        };
        setError(errorState);
        options.onError?.(errorState);
        throw err;
      }
    },
    [mutate, options],
  );

  const resetError = useCallback(() => {
    setError({ message: null, fieldErrors: {} });
    reset?.();
  }, [reset]);

  return {
    execute,
    isLoading,
    error: error.message,
    fieldErrors: error.fieldErrors,
    hasError: !!error.message || Object.keys(error.fieldErrors).length > 0,
    resetError,
    data,
    isSuccess,
  };
}
