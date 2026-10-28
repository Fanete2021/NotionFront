'use client';

import { useEffect, useId, useState } from 'react';
import { aiActions } from '../../model/ai-actions';
import { handleAiMenuKeyDown } from '../../lib/handle-ai-menu-key-down';
import styles from './AiPopover.module.css';
import { AiAction } from '@entities/ai-assistant';
import WandIcon from '@shared/assets/icons/wand.svg';
import { useDismissibleLayer } from '@shared/lib/hooks';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { ContextMenu } from '@shared/ui/context-menu';

type AiMenuProps = {
  disabled?: boolean;
  onOpen: () => void;
  onSelect: (mode: AiAction) => void;
};

export function AiMenu({ disabled, onOpen, onSelect }: AiMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useDismissibleLayer<HTMLDivElement>({
    enabled: open,
    onDismiss: (reason) => {
      setOpen(false);
      if (reason === 'escape') wrapperRef.current?.querySelector('button')?.focus();
    },
  });

  useEffect(() => {
    if (open) wrapperRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  }, [open, wrapperRef]);

  return (
    <div ref={wrapperRef} className={styles.menuWrapper}>
      <Button
        variant="clear"
        size="sm"
        className={styles.aiButton}
        aria-label="Действия ИИ"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (!open) onOpen();
          setOpen(!open);
        }}
      >
        <WandIcon aria-hidden /> ИИ <span className={styles.aiBadge}>NEW</span>
      </Button>
      {open && (
        <Card className={styles.menuPopup}>
          <ContextMenu
            id={menuId}
            className={styles.menu}
            aria-label="Действия с выделенным текстом"
            onKeyDown={handleAiMenuKeyDown}
          >
            <li role="presentation" className={styles.menuHeading}>
              С выделенным текстом
            </li>
            {aiActions.map(({ action, icon }) => {
              const Icon = icon;
              return (
                <li
                  key={action}
                  role="none"
                  className={action === 'write' ? styles.askItem : undefined}
                >
                  <Button
                    variant="clear"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => {
                      setOpen(false);
                      onSelect(action);
                    }}
                  >
                    <span className={styles.menuIcon}>
                      <Icon aria-hidden />
                    </span>
                    {action}
                  </Button>
                </li>
              );
            })}
          </ContextMenu>
        </Card>
      )}
    </div>
  );
}
