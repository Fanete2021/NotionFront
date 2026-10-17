import styles from './ArticleHeader.module.css';
import type { PublishedDocument } from '@entities/published-document';
import { Avatar } from '@shared/ui/avatar';
import { Typography } from '@shared/ui/typography';
import CalendarIcon from '@shared/assets/icons/calendar.svg';
import ClockIcon from '@shared/assets/icons/clock.svg';

type ArticleHeaderProps = {
  document: Pick<
    PublishedDocument,
    'icon' | 'title' | 'author' | 'publishedAt' | 'publishedLabel' | 'readingMinutes'
  >;
};

export const ArticleHeader = ({ document }: ArticleHeaderProps) => (
  <header className={styles.articleHeader}>
    <span className={styles.icon} aria-hidden="true">
      {document.icon}
    </span>
    <Typography variant="h1" className={styles.title}>
      {document.title}
    </Typography>
    <div className={styles.meta}>
      <div className={styles.author}>
        <Avatar
          name={document.author.name}
          src={document.author.avatarUrl}
          size="md"
          aria-hidden="true"
        />
        <div>
          <p className={styles.authorName}>{document.author.name}</p>
          <p className={styles.authorDescription}>{document.author.description}</p>
        </div>
      </div>
      <div className={styles.details}>
        <time dateTime={document.publishedAt}>
          <CalendarIcon aria-hidden="true" />
          {document.publishedLabel}
        </time>
        <span>
          <ClockIcon aria-hidden="true" />
          {document.readingMinutes} мин чтения
        </span>
      </div>
    </div>
  </header>
);
