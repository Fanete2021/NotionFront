'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
import { LogOut } from 'lucide-react';
import styles from './UserProfile.module.css';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { useAppDispatch } from '@shared/lib';
import { loggedOut } from '@shared/api';
import { Button } from '@/shared/ui/Button';
import MoreIcon from '@/shared/assets/icons/more.svg';

interface UserProfileProps {
  name: string;
  email: string;
}

export function UserProfile({ name, email }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    setIsOpen(false);
    dispatch(loggedOut());
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.profile}>
      <Avatar name={name} size="lg" className={styles.avatar} />

      <div className={styles.userInfo}>
        <Typography variant="text-label" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="caption" className={styles.email}>
          {email}
        </Typography>
      </div>

      <div className={styles.actions}>
        <Button
          variant="clear"
          className={styles.moreBtn}
          aria-label="Действия с профилем"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <MoreIcon className={styles.moreIcon} aria-hidden="true" />
        </Button>

        {isOpen && (
          <ul
            ref={menuRef}
            className={styles.profileActions}
            role="menu"
            aria-label="Действия с профилем"
          >
            <li role="none">
              <Button
                variant="clear"
                className={classNames(styles.profileAction, styles.logout)}
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut className={styles.actionIcon} aria-hidden="true" />
                Выйти
              </Button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
