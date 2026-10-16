'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { LogOut } from 'lucide-react';
import styles from './UserProfile.module.css';
import { useLogoutMutation } from '@features/auth';
import { Avatar } from '@shared/ui/avatar';
import { Typography } from '@shared/ui/typography';
import { useDismissibleLayer, useMutationWithError } from '@shared/lib';
import { Button } from '@shared/ui/button';
import MoreIcon from '@/shared/assets/icons/more.svg';
import { ContextMenu } from '@shared/ui/context-menu';
import { FormError } from '@shared/ui/form-error';

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export function UserProfile({ name, email, avatarUrl }: UserProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const actionsRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isMenuOpen,
    onDismiss: () => setIsMenuOpen(false),
  });

  const {
    execute: profileLogout,
    isLoading: isLoggingOut,
    error: logoutError,
  } = useMutationWithError(useLogoutMutation);

  const handleLogout = async () => {
    try {
      await profileLogout({
        body: {
          allDevices: false,
        },
      });
    } catch (error) {
      console.log(error);
    }

    setIsMenuOpen(false);
  };

  return (
    <div className={styles.profile}>
      <Avatar name={name} src={avatarUrl} size="lg" className={styles.avatar} />

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
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                <LogOut className={styles.actionIcon} aria-hidden="true" />
                {isLoggingOut ? 'Выход' : 'Выйти'}
              </Button>
            </li>
          </ContextMenu>
        )}
        <FormError message={logoutError} />
      </div>
    </div>
  );
}
