import { useEffect, useRef } from 'react';
import styles from './SearchInput.module.css';
import { Input } from '@shared/ui/Input';
import SearchBig from '@shared/assets/icons/search-big.svg';

export const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.search}>
      <Input
        ref={inputRef}
        placeholder="Поиск страниц..."
        addonLeft={<SearchBig className={styles.icon} />}
        size="m"
      />
    </div>
  );
};
