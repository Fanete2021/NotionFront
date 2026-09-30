'use client';

import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SidebarItem as SidebarItemType } from '../../../../../../model';
import { renderIcon } from '../../../../utils';
import styles from './SortableGroupHeader.module.css';
import { GroupDropdown } from '../../../../../../../sidebar/ui/sidebar-item/components/group/components/group-dropdown/GroupDropdown';
import ChevronRightIcon from '@shared/assets/icons/chevron-right-2.svg';
import ChevronDownIcon from '@shared/assets/icons/chevron-down.svg';
import DotsIcon from '@shared/assets/icons/dots.svg';
import DragHandleIcon from '@shared/assets/icons/drag-handle.svg';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

export interface SortableGroupHeaderProps {
  item: SidebarItemType;
  isOpen: boolean;
  isDropdownOpen: boolean;
  dropdownPosition: { top: number; right: number } | null;
  onToggle: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMoreClick: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SortableGroupHeader = forwardRef<HTMLDivElement, SortableGroupHeaderProps>(
  function SortableGroupHeader(
    {
      item,
      isOpen,
      isDropdownOpen,
      dropdownPosition,
      onToggle,
      onContextMenu,
      onMoreClick,
      onEdit,
      onDelete,
    },
    moreRef,
  ) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: item.id,
      animateLayoutChanges: () => false,
    });

    const sortableStyle = {
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging ? 0 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={sortableStyle}
        className={styles.groupHeader}
        onContextMenu={onContextMenu}
        {...attributes}
      >
        <div
          {...listeners}
          className={styles.dragHandle}
          onClick={(e) => e.stopPropagation()}
          aria-label="Перетащить проект"
        >
          <DragHandleIcon className={styles.dragHandleIcon} />
        </div>

        <Button
          variant="clear"
          className={styles.arrowButton}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isOpen ? (
            <ChevronDownIcon className={styles.arrow} />
          ) : (
            <ChevronRightIcon className={styles.arrow} />
          )}
        </Button>

        {renderIcon(item, styles)}

        {!item.icon && item.color && (
          <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
        )}

        <Typography className={styles.title} variant="label">
          {item.title}
        </Typography>

        <div className={styles.moreWrapper} ref={moreRef}>
          <Button size="sm" variant="clear" className={styles.moreBtn} onClick={onMoreClick}>
            <DotsIcon />
          </Button>

          <GroupDropdown
            isOpen={isDropdownOpen}
            position={dropdownPosition}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    );
  },
);
