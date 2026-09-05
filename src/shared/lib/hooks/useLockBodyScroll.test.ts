import { describe, it, beforeEach, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLockBodyScroll } from './useLockBodyScroll';

describe('useLockBodyScroll', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('блокирует скролл, если захват активен', () => {
    const { unmount } = renderHook(() => useLockBodyScroll(true));

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('ничего не трогает, если isLocked = false', () => {
    const { unmount } = renderHook(() => useLockBodyScroll(false));

    expect(document.body.style.overflow).toBe('');

    unmount();
  });

  it('держит блокировку, если открыт хотя бы один захват', () => {
    const first = renderHook(() => useLockBodyScroll(true));
    const second = renderHook(() => useLockBodyScroll(true));

    expect(document.body.style.overflow).toBe('hidden');

    second.unmount();

    expect(document.body.style.overflow).toBe('hidden');

    first.unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('возвращает прежнее значение, а не сбрасывает overflow в visible', () => {
    document.body.style.overflow = 'scroll';

    const { unmount } = renderHook(() => useLockBodyScroll(true));

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('scroll');
  });
});
