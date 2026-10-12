'use client';

import classNames from 'classnames';
import styles from './GroupDropdown.module.css';
import PencilIcon from '@shared/assets/icons/pencil-3.svg';
import TrashIcon from '@shared/assets/icons/trash-2.svg';
import { Button } from '@/shared/ui/Button';

interface GroupDropdownProps {
  isOpen: boolean;
  position: { top: number; right: number } | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function GroupDropdown({ isOpen, position, onEdit, onDelete }: GroupDropdownProps) {
  if (!isOpen || !position) return null;

  return (
    <div
      className={styles.dropdown}
      style={{
        position: 'fixed',
        top: position.top,
        right: position.right,
      }}
    >
      <Button variant="clear" className={styles.dropdownItem} onClick={onEdit}>
        <PencilIcon className={styles.menuIcon} />
        Переименовать
      </Button>

      <div className={styles.menuDivider} />

      <Button
        variant="clear"
        className={classNames(styles.dropdownItem, styles.menuItemDanger)}
        onClick={onDelete}
      >
        <TrashIcon className={styles.menuIcon} />
        Удалить
      </Button>
    </div>
  );
}
