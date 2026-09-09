'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { LogOut } from 'lucide-react';
import styles from './UserProfile.module.css';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { useAppDispatch, useDismissibleLayer } from '@shared/lib';
import { loggedOut } from '@shared/api';
import { Button } from '@/shared/ui/Button';
import MoreIcon from '@/shared/assets/icons/more.svg';
import { ContextMenu } from '@shared/ui/context-menu';

interface UserProfileProps {
  name: string;
  email: string;
}

export function UserProfile({ name, email }: UserProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const actionsRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isMenuOpen,
    onDismiss: () => setIsMenuOpen(false),
  });

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    setIsMenuOpen(false);
    dispatch(loggedOut());
  };

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

      <div ref={actionsRef} className={styles.actions}>
        <Button
          variant="clear"
          className={styles.moreBtn}
          aria-label="Действия с профилем"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <MoreIcon className={styles.moreIcon} aria-hidden="true" />
        </Button>

        {isMenuOpen && (
          <ContextMenu
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
          </ContextMenu>
        )}
      </div>
    </div>
  );
}
