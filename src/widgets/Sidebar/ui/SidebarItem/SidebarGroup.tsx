'use client';

import { useState, useRef } from 'react';
import { SidebarItem as SidebarItemType } from '../../model/types/sidebar';
import { SidebarItem } from './SidebarItem';
import styles from './SidebarItem.module.css';
import { renderIcon } from '@/widgets/Sidebar/ui/SidebarItem/utils';
import { useDeleteProjectMutation } from '@/entities/project';
import ChevronRightIcon from '@/shared/assets/icons/chevron-right-2.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import MoreIcon from '@/shared/assets/icons/more.svg';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import { useAppDispatch, openEditProjectModal, openCreateDocumentModal } from '@/shared/lib';

interface SidebarGroupProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarGroup({ item, level }: SidebarGroupProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [deleteProject] = useDeleteProjectMutation();

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCreateDocument = () => {
    setContextMenu(null);
    dispatch(openCreateDocumentModal({ projectId: item.id }));
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    dispatch(
      openEditProjectModal({
        projectId: item.id,
        projectName: item.title || '',
        color: item.color,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
      }),
    );
  };

  const handleDelete = async () => {
    setIsDropdownOpen(false);
    if (!confirm(`Удалить проект "${item.title}"?`)) return;
    try {
      await deleteProject(item.id).unwrap();
    } catch (err) {
      console.error('Ошибка удаления проекта:', err);
    }
  };

  return (
    <>
      <div className={styles.group} onContextMenu={handleContextMenu}>
        <div className={styles.groupHeader} onClick={handleToggle}>
          <Button
            variant="clear"
            className={styles.arrowButton}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {isOpen ? (
              <ChevronDownIcon className={styles.arrow} />
            ) : (
              <ChevronRightIcon className={styles.arrow} />
            )}
          </Button>

          {renderIcon(item)}

          {!item.icon && item.color && (
            <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
          )}

          <Typography className={styles.title} variant="label">
            {item.title}
          </Typography>

          <div className={styles.moreWrapper} ref={dropdownRef}>
            <Button variant="clear" className={styles.moreBtn} onClick={handleMoreClick}>
              <MoreIcon className={styles.moreIcon} />
            </Button>

            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <Button variant="clear" className={styles.dropdownItem} onClick={handleEdit}>
                  <span className={styles.dropdownIcon}>✏️</span>
                  Редактировать
                </Button>
                <div className={styles.dropdownDivider}></div>
                <Button
                  variant="clear"
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={handleDelete}
                >
                  <span className={styles.dropdownIcon}>🗑️</span>
                  Удалить
                </Button>
              </div>
            )}
          </div>
        </div>

        {isOpen && item.children && item.children.length > 0 && (
          <div className={styles.children}>
            {item.children?.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>

      {contextMenu && (
        <div
          ref={menuRef}
          className={styles.contextMenu}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
          }}
        >
          <Button className={styles.contextMenuItem} onClick={handleCreateDocument}>
            <span className={styles.contextMenuIcon}>📄</span>
            Создать документ
          </Button>
        </div>
      )}
    </>
  );
}
