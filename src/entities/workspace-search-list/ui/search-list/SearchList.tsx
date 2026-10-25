import styles from './SearchList.module.css';
import type { SearchItem as SearchItemData } from '../../model/types/searchItem';
import { SearchItem } from '../search-item/SearchItem';
import { Typography } from '@shared/ui/typography';
import { Button } from '@shared/ui/button';

interface SearchListProps {
  items: SearchItemData[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  message?: string;
  query?: string;
  limitReached?: boolean;
}

export const SearchList = ({
  items,
  isLoading,
  isError,
  onRetry,
  message,
  query,
  limitReached,
}: SearchListProps) => {
  if (message || isLoading || isError) {
    return (
      <div className={styles.searchBody} aria-live="polite" aria-busy={isLoading}>
        <Typography variant="text-regular" role={isError ? 'alert' : 'status'}>
          {message || (isLoading ? 'Загрузка страниц...' : 'Не удалось загрузить страницы')}
        </Typography>
        {isError && !message && !isLoading && <Button onClick={onRetry}>Повторить</Button>}
      </div>
    );
  }

  return (
    <div className={styles.searchBody}>
      <Typography variant="text-regular" className={styles.totalResult} role="status">
        {items.length === 0 ? 'Страницы не найдены' : `Найдено страниц: ${items.length}`}
        {query && ` по запросу «${query}»`}
      </Typography>
      {limitReached && (
        <Typography variant="caption">
          Показаны первые {items.length} результатов. Уточните запрос или выберите фильтры.
        </Typography>
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <SearchItem searchItem={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
