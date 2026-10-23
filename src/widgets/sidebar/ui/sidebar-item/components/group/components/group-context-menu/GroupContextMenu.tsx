'use client';

import styles from './GroupContextMenu.module.css';
import DocsIcon from '@shared/assets/icons/docs.svg';
import { Button } from '@/shared/ui/button';
import { useDismissibleLayer } from '@/shared/lib';

interface GroupContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  onCreateDocument: () => void;
  onClose: () => void;
}

export function GroupContextMenu({
  isOpen,
  position,
  onCreateDocument,
  onClose,
}: GroupContextMenuProps) {
  const menuRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isOpen && position !== null,
    onDismiss: onClose,
  });

  if (!isOpen || !position) return null;

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
      }}
    >
      <Button variant="clear" className={styles.contextMenuItem} onClick={onCreateDocument}>
        <DocsIcon className={styles.menuIcon} />
        Создать документ
      </Button>
    </div>
  );
}
