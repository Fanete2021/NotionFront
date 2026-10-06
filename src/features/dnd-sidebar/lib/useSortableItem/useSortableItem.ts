'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface UseSortableItemOptions {
  id: string;
  type: 'group' | 'document';
  disabled?: boolean;
}

export function useSortableItem({ id, type, disabled }: UseSortableItemOptions) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    data: { type },
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,
  };
}
