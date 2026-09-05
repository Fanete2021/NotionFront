'use client';

import { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './NavLink.module.css';
import { Typography } from '@/shared/ui/Typography';

export type NavLinkSize = 'sm' | 'md';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  className?: string;

  // Подсвечивает пункт как текущий
  active?: boolean;

  // Высота и отступы строки
  size?: NavLinkSize;

  // Типографика подписи
  labelVariant?: ComponentProps<typeof Typography>['variant'];

  // Иконка слева от подписи
  addonLeft?: ReactNode;

  children: ReactNode;
};

export const NavLink = ({
  className,
  active = false,
  size = 'md',
  labelVariant = 'text-medium',
  addonLeft,
  children,
  ...props
}: NavLinkProps) => {
  return (
    <Link
      className={classNames(styles.link, { [styles.active]: active }, styles[size], className)}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {addonLeft && <span className={styles.addonLeft}>{addonLeft}</span>}
      <Typography variant={labelVariant} className={styles.label}>
        {children}
      </Typography>
    </Link>
  );
};
