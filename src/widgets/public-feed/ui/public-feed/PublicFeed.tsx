'use client';

import Link from 'next/link';
import styles from './PublicFeed.module.css';
import { useGetArticleListQuery } from '@entities/published-document';
import { formatRelativeTime } from '@shared/lib';
import { ROUTES } from '@shared/routes';
import { Avatar } from '@shared/ui/avatar';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';
import { Typography } from '@shared/ui/typography';
import SearchIcon from '@shared/assets/icons/search.svg';
import ChevronLeft from '@shared/assets/icons/chevron-left.svg';
import ChevronRight from '@shared/assets/icons/chevron-right-2.svg';

const PAGE_LIMIT = 20;

type PublicFeedProps = {
  search: string;
  page: number;
  cursor?: string;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
  onResetSearch: () => void;
};

export const PublicFeed = ({
  search,
  page,
  cursor,
  onNextPage,
  onPreviousPage,
  onResetSearch,
}: PublicFeedProps) => {
  const normalizedSearch = search.trim().toLocaleLowerCase('ru-RU');

  const {
    currentData: documents,
    isFetching,
    isError,
    refetch,
  } = useGetArticleListQuery({
    limit: PAGE_LIMIT,
    cursor,
  });

  const filteredDocuments = (documents?.items ?? []).filter((document) =>
    [document.title, document.seoTitle, document.seoDescription, document.author.name].some(
      (value) => value.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
    ),
  );

  const nextCursor = documents?.nextCursor;

  const handleNextPage = () => {
    if (isFetching || isError || !nextCursor) return;
    onNextPage(nextCursor);
  };

  return (
    <main className={styles.main} aria-busy={isFetching}>
      <div className={styles.intro}>
        <Typography variant="h1" className={styles.title}>
          Публичная лента
        </Typography>
        <Typography className={styles.subtitle}>
          Исследуйте лучшие практики, шаблоны и мысли нашего сообщества.
        </Typography>
        {normalizedSearch && (
          <Typography className={styles.searchHint}>
            Поиск среди статей на текущей странице.
          </Typography>
        )}
      </div>

      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {isFetching
          ? 'Загрузка публикаций'
          : isError
            ? 'Не удалось загрузить публикации'
            : `Публикаций на странице: ${filteredDocuments.length}. Страница ${page}.`}
      </div>

      {isFetching && !documents ? (
        <div className={styles.list} aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.loadingItem}>
              <Skeleton width={180} height={24} />
              <Skeleton height={64} />
              <Skeleton height={78} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className={styles.empty} role="alert">
          <Typography variant="h2" className={styles.emptyTitle}>
            Не удалось загрузить публикации
          </Typography>
          <Typography className={styles.emptyDescription}>
            Попробуйте загрузить страницу ещё раз.
          </Typography>
          <Button variant="outline" onClick={() => void refetch()}>
            Повторить
          </Button>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className={styles.list}>
          {filteredDocuments.map((document) => (
            <article key={document.id} className={styles.article}>
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
                <time dateTime={document.publishedAt}>
                  {formatRelativeTime(document.publishedAt)}
                </time>
              </div>
              <Typography variant="h2" className={styles.articleTitle}>
                <Link href={`${ROUTES.publicFeed}/${document.slug}`}>{document.title}</Link>
              </Typography>
              <Typography className={styles.description}>{document.seoDescription}</Typography>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SearchIcon aria-hidden="true" className={styles.emptyIcon} />
          <Typography variant="h2" className={styles.emptyTitle}>
            {normalizedSearch ? 'Ничего не найдено' : 'Публикаций пока нет'}
          </Typography>
          <Typography className={styles.emptyDescription}>
            {normalizedSearch
              ? 'Попробуйте другой запрос или сбросьте поиск.'
              : 'Здесь появятся опубликованные страницы сообщества.'}
          </Typography>
          {normalizedSearch && (
            <Button variant="outline" onClick={onResetSearch}>
              Сбросить поиск
            </Button>
          )}
        </div>
      )}

      {(page > 1 || nextCursor) && (
        <nav aria-label="Страницы публичной ленты" className={styles.pagination}>
          <Button
            variant="clear"
            className={styles.pageDirection}
            disabled={page === 1 || isFetching}
            onClick={onPreviousPage}
          >
            <ChevronLeft aria-hidden="true" />
            Назад
          </Button>
          <span className={styles.pageNumber} aria-current="page" aria-label={`Страница ${page}`}>
            {page}
          </span>
          <Button
            variant="clear"
            className={styles.pageDirection}
            disabled={isFetching || isError || !nextCursor}
            onClick={handleNextPage}
          >
            Вперед
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      )}
    </main>
  );
};
