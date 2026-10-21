import Link from 'next/link';
import styles from './ArticleNotFound.module.css';
import { PublicHeader } from '@widgets/public-header';
import { ROUTES } from '@shared/routes';
import { Typography } from '@shared/ui/typography';

export const ArticleNotFound = () => (
  <>
    <PublicHeader />
    <main className={styles.notFound}>
      <Typography variant="h1">Публикация не найдена</Typography>
      <Typography>Возможно, документ больше не опубликован или ссылка указана неверно.</Typography>
      <Link href={ROUTES.publicFeed}>Вернуться в публичную ленту</Link>
    </main>
  </>
);
