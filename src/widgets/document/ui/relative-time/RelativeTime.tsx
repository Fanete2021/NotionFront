'use client';

import { useRelativeTimeTick } from '@shared/lib';
import { formatRelativeTime } from '@shared/lib/format-relative-time/formatRelativeTime';

interface RelativeTimeProps {
  date: string;
}

export const RelativeTime = ({ date }: RelativeTimeProps) => {
  const tick = useRelativeTimeTick(15_000);
  return <>{formatRelativeTime(date, tick)}</>;
};
