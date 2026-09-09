import { type RefObject, useEffect, useRef } from 'react';

export type DismissReason = 'escape' | 'outside-pointer';

interface UseDismissibleLayerOptions {
  enabled: boolean;
  onDismiss: (reason: DismissReason) => void;
}

export const useDismissibleLayer = <T extends HTMLElement>({
  enabled,
  onDismiss,
}: UseDismissibleLayerOptions): RefObject<T | null> => {
  const layerRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss('escape');
      }
    };

    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target;
      const layer = layerRef.current;

      if (layer && target instanceof Node && !layer.contains(target)) {
        onDismiss('outside-pointer');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [enabled, onDismiss]);

  return layerRef;
};
