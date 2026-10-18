import styles from './ArticleHeader.module.css';
import type { PublicArticleDetailEntity } from '@entities/published-document';
import { formatRelativeTime } from '@shared/lib';
import { getTiptapText } from '@shared/lib/tiptap/getTiptapText';
import { getIconByName } from '@shared/ui/icon-picker';
import { Avatar } from '@shared/ui/avatar';
import { Typography } from '@shared/ui/typography';
import CalendarIcon from '@shared/assets/icons/calendar.svg';
import ClockIcon from '@shared/assets/icons/clock.svg';

type ArticleHeaderProps = {
  document: Pick<
    PublicArticleDetailEntity,
    'icon' | 'title' | 'author' | 'publishedAt' | 'content'
  >;
};

const CHARACTERS_PER_MINUTE = 1200;

const renderArticleIcon = (icon: string) => {
  const Icon = getIconByName(icon);
  return Icon ? <Icon /> : icon;
};

export const ArticleHeader = ({ document }: ArticleHeaderProps) => {
  const text = getTiptapText(document.content.json).trim();
  const characterCount = Array.from(text).length;
  const readingMinutes = Math.max(1, Math.ceil(characterCount / CHARACTERS_PER_MINUTE));

  return (
    <header className={styles.articleHeader}>
      {document.icon && (
        <span className={styles.icon} aria-hidden="true">
          {renderArticleIcon(document.icon)}
        </span>
      )}
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
          </div>
        </div>
        <div className={styles.details}>
          <time dateTime={document.publishedAt}>
            <CalendarIcon aria-hidden="true" />
            {formatRelativeTime(document.publishedAt)}
          </time>
          <span>
            <ClockIcon aria-hidden="true" />
            {readingMinutes} мин чтения
          </span>
        </div>
      </div>
    </header>
  );
};
