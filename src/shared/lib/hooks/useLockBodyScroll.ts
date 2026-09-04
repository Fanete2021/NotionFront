'use client';

import { useEffect } from 'react';

let locks = 0;
let restoreOverflow = '';

/**
 * Запрещает скроллить страницу, пока `isLocked` = true.
 *
 * Если открыто несколько модалок сразу, скролл вернётся только после того,
 * как закроется последняя.
 */
export const useLockBodyScroll = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    if (locks === 0) {
      restoreOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    locks += 1;

    return () => {
      locks -= 1;

      if (locks === 0) {
        document.body.style.overflow = restoreOverflow;
      }
    };
  }, [isLocked]);
};
