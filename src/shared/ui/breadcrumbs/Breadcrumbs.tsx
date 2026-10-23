import Link from 'next/link';
import classNames from 'classnames';
import styles from './Breadcrumbs.module.css';
import ChevronRight from '@shared/assets/icons/chevron-right-2.svg';

export type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => (
  <nav aria-label="Хлебные крошки" className={classNames(styles.breadcrumbs, className)}>
    <ol className={styles.list}>
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <li key={`${item.label}-${index}`} className={styles.item}>
            {index > 0 && <ChevronRight aria-hidden="true" className={styles.separator} />}
            {item.href && !isCurrent ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isCurrent ? 'page' : undefined}
                className={classNames(styles.label, { [styles.current]: isCurrent })}
              >
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
