'use client';

import classnames from 'classnames';
import { memo } from 'react';
import styles from './Table.module.css';
import { TableProps } from './types';

function TableComponent<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = 'Нет данных',
  className,
  style,
  onRowClick,
  rowClassName,
}: TableProps<T>) {
  return (
    <div className={classnames(styles.wrapper, className)} style={style}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                className={classnames(styles.headCell, styles[column.align ?? 'left'])}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                Загрузка...
              </td>
            </tr>
          )}

          {!loading && !data.length && (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyText}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row) => (
              <tr
                key={typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey])}
                className={classnames(styles.row, rowClassName?.(row))}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={classnames(styles.cell, styles[column.align ?? 'left'])}
                  >
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export const Table = memo(TableComponent) as <T>(props: TableProps<T>) => React.ReactElement;
