'use client';

import { useEffect, useId, useState } from 'react';
import type { AiAnchorRect, AiApplyMode, AiSession } from '../../model/ai-types';
import { useAiPopoverPosition } from '../../lib/use-ai-popover-position';
import { AiPromptForm } from '../ai-prompt-form/AiPromptForm';
import styles from './AiPopover.module.css';
import WandIcon from '@shared/assets/icons/wand.svg';
import CloseIcon from '@shared/assets/icons/close.svg';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Portal } from '@shared/ui/portal';
import { Typography } from '@shared/ui/typography';
import { useDismissibleLayer } from '@shared/lib/hooks';

type AiPopoverProps = {
  session: AiSession;
  getAnchorRect: () => AiAnchorRect;
  onClose: (restoreFocus?: boolean) => void;
  onApply: (text: string, mode: AiApplyMode) => void;
};

export function AiPopover({ session, getAnchorRect, onClose, onApply }: AiPopoverProps) {
  const [action, setAction] = useState(session.initialAction);
  const titleId = useId();
  const popupRef = useDismissibleLayer<HTMLDivElement>({
    enabled: true,
    onDismiss: (reason) => onClose(reason === 'escape'),
  });
  const position = useAiPopoverPosition(getAnchorRect, popupRef);
  const isPositioned = position !== null;
  const { selectedText } = session;

  useEffect(() => {
    if (isPositioned) popupRef.current?.querySelector('textarea')?.focus();
  }, [isPositioned, popupRef]);

  return (
    <Portal>
      <Card
        ref={popupRef}
        className={styles.popup}
        role="dialog"
        aria-labelledby={titleId}
        data-positioned={Boolean(position)}
        style={
          position
            ? { left: position.left, top: position.top, maxHeight: position.maxHeight }
            : undefined
        }
      >
        <span className={styles.arrow} data-side={position?.side} aria-hidden />
        <header className={styles.header}>
          <div className={styles.heading}>
            <span className={styles.logo}>
              <WandIcon aria-hidden />
            </span>
            <Typography id={titleId} variant="text-label" className={styles.title}>
              ИИ-ассистент
            </Typography>
          </div>
          <Button
            variant="clear"
            onClick={() => onClose(true)}
            className={styles.close}
            aria-label="Закрыть ИИ-ассистент"
          >
            <CloseIcon aria-hidden />
          </Button>
        </header>
        <AiPromptForm
          action={action}
          selectedText={selectedText}
          originalText={session.originalText}
          onActionChange={setAction}
          onCancel={() => onClose(true)}
          onApply={onApply}
        />
      </Card>
    </Portal>
  );
}
