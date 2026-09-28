type FilterColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface FilterItem {
  label: string;
  color: FilterColor;
}
