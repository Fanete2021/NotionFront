'use client';

import styles from './GroupContextMenu.module.css';
import DocsIcon from '@shared/assets/icons/docs.svg';
import { Button } from '@/shared/ui/Button';

interface GroupContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  onCreateDocument: () => void;
  onClose: () => void;
}

export function GroupContextMenu({ isOpen, position, onCreateDocument }: GroupContextMenuProps) {
  if (!isOpen || !position) return null;

  return (
    <div
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
