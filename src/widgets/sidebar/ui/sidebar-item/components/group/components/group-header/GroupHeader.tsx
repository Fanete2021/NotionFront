'use client';

import { forwardRef } from 'react';
import classNames from 'classnames';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes } from '@dnd-kit/core';
import { SidebarItemData } from '../../../../../../model';
import { renderIcon } from '../../../../utils';
import styles from './GroupHeader.module.css';
import ChevronRightIcon from '@/shared/assets/icons/chevron-right-2.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import DotsIcon from '@/shared/assets/icons/dots.svg';
import DragHandleIcon from '@/shared/assets/icons/drag-handle.svg';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

export interface GroupHeaderProps {
  item: SidebarItemData;
  isOpen: boolean;
  isDropdownOpen: boolean;
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
  onToggle: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMoreClick: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export const GroupHeader = forwardRef<HTMLDivElement, GroupHeaderProps>(function GroupHeader(
  {
    item,
    isOpen,
    isDropdownOpen,
    dragListeners,
    dragAttributes,
    onToggle,
    onContextMenu,
    onMoreClick,
    children,
  },
  moreRef,
) {
  return (
    <div className={styles.groupHeader} onContextMenu={onContextMenu} {...dragAttributes}>
      <div
        {...dragListeners}
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
        <Button
          size="sm"
          variant="clear"
          className={classNames(styles.moreBtn, {
            [styles.moreBtnActive]: isDropdownOpen,
          })}
          onClick={onMoreClick}
        >
          <DotsIcon />
        </Button>

        {children}
      </div>
    </div>
  );
});
