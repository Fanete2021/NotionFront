'use client'; // <-- Обязательно для компонентов, создающих обработчики событий

import styles from './Header.module.css';
import { Button } from '@shared/ui/Button';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Наш Notion Проект</h2>
      <Button onClick={() => alert('Работает!')}>Действие</Button>
    </header>
  );
};
