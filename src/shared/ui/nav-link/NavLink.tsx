'use client';

import { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './NavLink.module.css';
import { Typography } from '@/shared/ui/Typography';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  className?: string;

  // Подсвечивает пункт как текущий
  active?: boolean;

  // Иконка слева от подписи
  addonLeft?: ReactNode;

  children: ReactNode;
};

export const NavLink = ({
  className,
  active = false,
  addonLeft,
  children,
  ...props
}: NavLinkProps) => {
  return (
    <Link
      className={classNames(styles.link, { [styles.active]: active }, className)}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {addonLeft && <span className={styles.addonLeft}>{addonLeft}</span>}
      <Typography variant="text-medium" className={styles.label}>
        {children}
      </Typography>
    </Link>
  );
};
