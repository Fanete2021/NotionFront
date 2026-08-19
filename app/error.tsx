'use client';

import { UnexpectedError } from '@widgets/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <UnexpectedError code={500} error={error} onRetry={reset} />;
}
