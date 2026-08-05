'use client';

import { useState } from 'react';

import { SidebarItem as SidebarItemType } from '../../model/types/sidebar';
import { SidebarItem } from './SidebarItem';

import styles from './SidebarItem.module.css';
import { getPadding } from './utils';

import ChevronRightIcon from '@/shared/assets/icons/chevron-right-2.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';

import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

interface SidebarGroupProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarGroup({ item, level }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.group}>
      <div
        className={styles.groupHeader}
        style={{
          paddingInlineStart: getPadding(level),
        }}
        onClick={toggle}
      >
        <Button
          variant="clear"
          className={styles.arrowButton}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          {isOpen ? (
            <ChevronDownIcon className={styles.arrow} />
          ) : (
            <ChevronRightIcon className={styles.arrow} />
          )}
        </Button>

        {item.icon && <item.icon className={styles.icon} />}

        {item.color && (
          <span
            className={styles.colorDot}
            style={{
              backgroundColor: item.color,
            }}
          />
        )}

        <Typography className={styles.title} variant="label">
          {item.title}
        </Typography>

        <Button
          variant="clear"
          size="sm"
          className={styles.moreBtn}
          onClick={(e) => {
            e.stopPropagation();
            // Handle more button click
          }}
        >
          •••
        </Button>
      </div>

      {isOpen &&
        item.children?.map((child) => (
          <SidebarItem key={child.id} item={child} level={level + 1} />
        ))}
    </div>
  );
}
