import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import classNames from 'classnames';

import styles from './ContextMenu.module.css';

type ContextMenuProps = ComponentPropsWithoutRef<'ul'>;

export const ContextMenu = forwardRef<HTMLUListElement, ContextMenuProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ul {...props} ref={ref} role="menu" className={classNames(styles.menu, className)}>
        {children}
      </ul>
    );
  },
);

ContextMenu.displayName = 'ContextMenu';
