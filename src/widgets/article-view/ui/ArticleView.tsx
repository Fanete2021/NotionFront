import type { ReactNode } from 'react';
import styles from './ArticleView.module.css';
import { ArticleHeader } from './article-header/ArticleHeader';
import type { PublicArticleDetailEntity } from '@entities/published-document';
import { ROUTES } from '@shared/routes';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';

type ArticleViewProps = {
  document: PublicArticleDetailEntity;
  children: ReactNode;
};

export const ArticleView = ({ document, children }: ArticleViewProps) => {
  const breadcrumbs = [
    { label: 'Публичная лента', href: ROUTES.publicFeed },
    { label: document.title },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />
      <article>
        <ArticleHeader document={document} />
        {children}
      </article>
    </main>
  );
};
