import styles from './CommentsSidebar.module.css';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import CloseIcon from '@shared/assets/icons/x-close-2.svg';
import { Avatar } from '@shared/ui/Avatar';

const mockCommentCards = [
  {
    id: '1',
    name: 'Женя Л.',
    time: '1 час назад',
    text: 'Стоит ли добавить пример состояния hover для варианта ghost кнопки? Думаю, это важно задокументировать.',
    avatarClassName: styles.avatarGreen,
  },
  {
    id: '2',
    name: 'Марк Р.',
    time: '30 мин назад',
    text: 'Отличная идея, Женя — стоит ли прикрепить ссылку на Figma-компонент прямо в этом документе?',
    avatarClassName: styles.avatarOrange,
  },
];

type CommentsSidebarProps = {
  onClose?: () => void;
}

export const CommentsSidebar = ({ onClose }: CommentsSidebarProps) => {
  return (
    <aside className={styles.root}>
      <div className={styles.header}>
        <Typography variant="text-regular">Комментарии</Typography>
        <Button
          onClick={onClose}
          variant="clear"
          size="sm"
          square
          className={styles.closeButton}
          aria-label="Закрыть"
        >
          <CloseIcon className={styles.icon} />
        </Button>
      </div>
      <div className={styles.list}>
        {mockCommentCards.map((comment) => (
          <article key={comment.id} className={styles.card}>
            <div className={styles.cardHead}>
              <Avatar
                name={comment.name}
                size="sm"
                fontWeight={700}
                className={comment.avatarClassName}
              />
              <div className={styles.meta}>
                <Typography variant="label" className={styles.cardName}>
                  {comment.name}
                </Typography>
                <Typography variant="caption" className={styles.cardMeta}>
                  {comment.time}
                </Typography>
              </div>
            </div>
            <Typography variant="text-medium" className={styles.cardText}>
              {comment.text}
            </Typography>
            <div className={styles.cardActions}>
              <Button variant="clear" className={styles.action}>
                Ответить
              </Button>
              <Button variant="clear" className={styles.action}>
                Решить
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.footer}>
        <textarea
          className={styles.textarea}
          placeholder="Добавить комментарий..."
          rows={3}
        />
        <div className={styles.sendRow}>
          <Button variant="filled" size="sm" className={styles.sendButton}>
            Отправить
          </Button>
        </div>
      </div>
    </aside>
  )
};
