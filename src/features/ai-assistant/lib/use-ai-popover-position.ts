import { useLayoutEffect, useState, type RefObject } from 'react';
import type { AiAnchorRect } from '../model/ai-types';

type PopoverPosition = {
  left: number;
  top: number;
  maxHeight: number;
  side: 'top' | 'bottom';
};

export function useAiPopoverPosition(
  getAnchorRect: () => AiAnchorRect,
  popupRef: RefObject<HTMLDivElement | null>,
) {
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  useLayoutEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;

    const updatePosition = () => {
      const padding = 12;
      const gap = 10;
      const anchor = getAnchorRect();
      const viewportHeight = Math.max(0, window.innerHeight - padding * 2);
      const below = Math.max(
        0,
        Math.min(viewportHeight, window.innerHeight - anchor.bottom - gap - padding),
      );
      const above = Math.max(0, Math.min(viewportHeight, anchor.top - gap - padding));
      const side = below < popup.scrollHeight && above > below ? 'top' : 'bottom';
      const maxHeight = side === 'top' ? above : below;
      const left = Math.max(
        padding,
        Math.min(anchor.left, window.innerWidth - popup.offsetWidth - padding),
      );
      const preferredTop =
        side === 'top'
          ? Math.max(padding, anchor.top - gap - Math.min(popup.offsetHeight, maxHeight))
          : Math.max(padding, anchor.bottom + gap);
      const top = Math.max(
        padding,
        Math.min(
          preferredTop,
          window.innerHeight - Math.min(popup.offsetHeight, maxHeight) - padding,
        ),
      );

      setPosition((previous) =>
        previous?.left === left &&
        previous.top === top &&
        previous.maxHeight === maxHeight &&
        previous.side === side
          ? previous
          : { left, top, maxHeight, side },
      );
    };

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(popup);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('scroll', updatePosition, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', updatePosition, true);
    };
  }, [getAnchorRect, popupRef]);

  return position;
}
