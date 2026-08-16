'use client';

import { useRouter } from 'next/navigation';
import { ErrorPage } from '../ErrorPage';
import styles from './NotFoundError.module.css';
import NotFoundPage from '@shared/assets/icons/not-found-404-page.svg';
import HomeFilled from '@shared/assets/icons/house-filled.svg';
import Search from '@shared/assets/icons/search.svg';
import ArrowLeft from '@shared/assets/icons/arrow-left.svg';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';

export const NotFoundError = () => {
  const router = useRouter();
  return (
    <ErrorPage
      errorIcon=<NotFoundPage />
      title={
        <Typography className={styles.notFoundTitle} variant="h1">
          404
        </Typography>
      }
      description={
        <div className={styles.notFoundDescription}>
          <Typography variant="h3">Страница не найдена</Typography>
          <Typography variant="text-regular">
            Кажется, эта страница была удалена или
            <br />
            никогда не существовала.
          </Typography>
        </div>
      }
      buttonActions={
        <>
          <Button
            style={{ alignItems: 'start' }}
            variant="filled"
            addonLeft=<HomeFilled />
            onClick={() => router.replace('/')}
          >
            На главную
          </Button>
          <Button variant="outline" onClick={() => router.back()} addonLeft=<ArrowLeft />>
            Назад
          </Button>
        </>
      }
      afterActions={
        <Input
          className={styles.pageSearch}
          addonLeft=<Search />
          placeholder="Введите название страницы"
        />
      }
    ></ErrorPage>
  );
};
