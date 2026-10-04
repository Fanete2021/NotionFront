import { CSSProperties, ReactNode } from 'react';

export type TableAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  key: keyof T | string;
  title: ReactNode;

  width?: number | string;

  align?: TableAlign;

  sortable?: boolean;

  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];

  data: T[];

  rowKey: keyof T | ((row: T) => React.Key);

  loading?: boolean;

  emptyText?: ReactNode;

  className?: string;

  style?: CSSProperties;

  onRowClick?: (row: T) => void;

  rowClassName?: (row: T) => string;
}
