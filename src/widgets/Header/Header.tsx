"use client"; // <-- Обязательно для компонентов, создающих обработчики событий

import { Button } from '@shared/ui/Button';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Наш Notion Проект</h2>
      <Button onClick={() => alert('Работает!')}>Действие</Button>
    </header>
  );
};
