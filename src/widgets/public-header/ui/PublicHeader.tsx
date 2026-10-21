'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './PublicHeader.module.css';
import { useGetMeQuery } from '@entities/user';
import { selectSessionStatus } from '@shared/api';
import { useAppSelector } from '@shared/lib';
import { rememberAuthReturnTo } from '@shared/lib/authReturnTo';
import { ROUTES } from '@shared/routes';
import { Avatar } from '@shared/ui/avatar';

type PublicHeaderProps = { search?: ReactNode };

export const PublicHeader = ({ search }: PublicHeaderProps) => {
  const status = useAppSelector(selectSessionStatus);
  const { data: user } = useGetMeQuery(undefined, { skip: status === 'anonymous' });

  const rememberReturnTo = () => {
    rememberAuthReturnTo(`${window.location.pathname}${window.location.search}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {search && <div className={styles.search}>{search}</div>}
        <nav className={styles.account} aria-label="Аккаунт">
          {status === 'authenticated' && user ? (
            <Link href={ROUTES.main} className={styles.profile}>
              <span className={styles.userInfo}>
                <span className={styles.name}>{user.name}</span>
                <span className={styles.email}>{user.email}</span>
              </span>
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            </Link>
          ) : (
            <>
              <Link href={ROUTES.login} onClick={rememberReturnTo} className={styles.login}>
                Войти
              </Link>
              <Link
                href={ROUTES.registration}
                onClick={rememberReturnTo}
                className={styles.register}
              >
                Зарегистрироваться
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
