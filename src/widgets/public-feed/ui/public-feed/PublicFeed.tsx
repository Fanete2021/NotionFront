'use client';

import Link from 'next/link';
import classNames from 'classnames';
import styles from './PublicFeed.module.css';
import type { PublishedDocument } from '@entities/published-document';
import { ROUTES } from '@shared/routes';
import { Avatar } from '@shared/ui/avatar';
import { Button } from '@shared/ui/button';
import { Typography } from '@shared/ui/typography';
import SearchIcon from '@shared/assets/icons/search.svg';
import ChevronLeft from '@shared/assets/icons/chevron-left.svg';
import ChevronRight from '@shared/assets/icons/chevron-right-2.svg';

const PAGE_SIZE = 3;

type PublicFeedProps = {
  documents: PublishedDocument[];
  search: string;
  page: number;
  onPageChange: (page: number) => void;
  onResetSearch: () => void;
};

export const PublicFeed = ({
  documents,
  search,
  page,
  onPageChange,
  onResetSearch,
}: PublicFeedProps) => {
  const normalizedSearch = search.trim().toLocaleLowerCase('ru-RU');
  const filteredDocuments = documents.filter((document) =>
    [document.title, document.description, document.author.name].some((value) =>
      value.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
    ),
  );
  const pageCount = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const visibleDocuments = filteredDocuments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className={styles.main}>
      <div className={styles.intro}>
        <Typography variant="h1" className={styles.title}>
          Публичная лента
        </Typography>
        <Typography className={styles.subtitle}>
          Исследуйте лучшие практики, шаблоны и мысли нашего сообщества.
        </Typography>
      </div>

      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {filteredDocuments.length === 0
          ? 'Публикации не найдены'
          : `Найдено публикаций: ${filteredDocuments.length}. Страница ${page} из ${pageCount}.`}
      </div>

      {visibleDocuments.length > 0 ? (
        <div className={styles.list}>
          {visibleDocuments.map((document) => (
            <article key={document.slug} className={styles.article}>
              <div className={styles.meta}>
                <Avatar
                  name={document.author.name}
                  src={document.author.avatarUrl}
                  size="xs"
                  className={styles.avatar}
                  data-author={document.author.name}
                  aria-hidden="true"
                />
                <span className={styles.author}>{document.author.name}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={document.publishedAt}>{document.publishedLabel}</time>
              </div>
              <Typography variant="h2" className={styles.articleTitle}>
                <Link href={`${ROUTES.publicFeed}/${document.slug}`}>{document.title}</Link>
              </Typography>
              <Typography className={styles.description}>{document.description}</Typography>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SearchIcon aria-hidden="true" className={styles.emptyIcon} />
          <Typography variant="h2" className={styles.emptyTitle}>
            Ничего не найдено
          </Typography>
          <Typography className={styles.emptyDescription}>
            Попробуйте другой запрос или вернитесь ко всем публикациям.
          </Typography>
          <Button variant="outline" onClick={onResetSearch}>
            Сбросить поиск
          </Button>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="Страницы публичной ленты" className={styles.pagination}>
          <Button
            variant="clear"
            className={styles.pageDirection}
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
            Назад
          </Button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant="clear"
              className={classNames(styles.pageNumber, {
                [styles.activePage]: pageNumber === page,
              })}
              aria-label={`Страница ${pageNumber}`}
              aria-current={pageNumber === page ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant="clear"
            className={styles.pageDirection}
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Вперед
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      )}
    </main>
  );
};
