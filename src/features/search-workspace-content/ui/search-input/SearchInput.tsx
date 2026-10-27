import { useEffect, useRef } from 'react';
import styles from './SearchInput.module.css';
import { Input } from '@shared/ui/input';
import SearchBig from '@shared/assets/icons/search-big.svg';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.search}>
      <Input
        ref={inputRef}
        placeholder="Поиск страниц..."
        aria-label="Поиск страниц"
        type="search"
        maxLength={200}
        value={value}
        onChange={onChange}
        addonLeft={<SearchBig className={styles.icon} />}
        size="m"
      />
    </div>
  );
};
