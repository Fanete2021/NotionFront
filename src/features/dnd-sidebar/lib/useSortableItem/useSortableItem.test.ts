import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(() => ({
    attributes: { role: 'button' },
    listeners: { onPointerDown: vi.fn() },
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  })),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: vi.fn((transform) => (transform ? 'translate(0, 0)' : undefined)),
    },
  },
}));

import { useSortable } from '@dnd-kit/sortable';
import { useSortableItem } from './useSortableItem';

describe('useSortableItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('передаёт id и type в useSortable', () => {
    renderHook(() => useSortableItem({ id: 'item-1', type: 'group' }));

    expect(useSortable).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'item-1',
        data: { type: 'group' },
        animateLayoutChanges: expect.any(Function),
      }),
    );
  });

  it('передаёт disabled в useSortable', () => {
    renderHook(() => useSortableItem({ id: 'item-1', type: 'document', disabled: true }));

    expect(useSortable).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'item-1',
        disabled: true,
      }),
    );
  });

  it('возвращает attributes и listeners из useSortable', () => {
    const { result } = renderHook(() => useSortableItem({ id: 'item-1', type: 'group' }));

    expect(result.current.attributes).toEqual({ role: 'button' });
    expect(result.current.listeners).toBeDefined();
  });

  it('устанавливает opacity = 0, если isDragging = true', () => {
    vi.mocked(useSortable).mockReturnValueOnce({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: true,
    } as never);

    const { result } = renderHook(() => useSortableItem({ id: 'item-1', type: 'group' }));

    expect(result.current.style.opacity).toBe(0);
  });

  it('устанавливает opacity = 1, если isDragging = false', () => {
    const { result } = renderHook(() => useSortableItem({ id: 'item-1', type: 'group' }));

    expect(result.current.style.opacity).toBe(1);
  });
});
