'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ErrorBadge } from './error-badge/ErrorBadge';
import { ErrorPage } from '../ErrorPage';
import { ErrorDetails } from './error-details/ErrorDetails';
import styles from '../ErrorPage.module.css';
import UnexpectedErrorIcon from '@shared/assets/icons/unknown-error-page.svg';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import Home from '@shared/assets/icons/home.svg';
import Retry from '@shared/assets/icons/refresh.svg';

export interface ErrorProps {
  code: number | string;
  error: Error & {
    digest?: string;
  };
  onRetry: () => void;
}

export const UnexpectedError = ({ error, onRetry, code }: ErrorProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const handleGoHome = () => {
    if (pathName === '/') {
      onRetry();
      return;
    }

    router.replace('/');
  };

  return (
    <ErrorPage
      errorIcon={<UnexpectedErrorIcon />}
      title={<ErrorBadge errorCode={`#ERR_${code}`} />}
      description={
        <div className={styles.notFoundDescription}>
          <Typography variant="h3">Что-то пошло не так</Typography>
          <Typography variant="text-regular">
            Произошла непредвиденная ошибка. Мы уже работаем над её устранением.
          </Typography>
        </div>
      }
      buttonActions={
        <>
          <Button variant="filled" addonLeft={<Retry />} onClick={onRetry}>
            Попробовать снова
          </Button>
          <Button variant="outline" addonLeft={<Home />} onClick={handleGoHome}>
            На главную
          </Button>
        </>
      }
      afterActions={<ErrorDetails error={error} errorCode={code} occuredAt={new Date()} />}
    ></ErrorPage>
  );
};
