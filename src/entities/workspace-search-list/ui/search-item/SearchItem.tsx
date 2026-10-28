import Link from 'next/link';
import styles from './SearchItem.module.css';
import type { SearchItem as SearchItemData } from '../../model/types/searchItem';
import { Card } from '@shared/ui/card';
import { Typography } from '@shared/ui/typography';
import { getIconByName } from '@shared/ui/icon-picker';
import PageIcon from '@shared/assets/icons/page.svg';
import { ROUTES } from '@shared/routes';

interface SearchItemProps {
  searchItem: SearchItemData;
}

const renderSearchIcon = (icon: SearchItemData['icon']) => {
  const Icon = getIconByName(icon);

  return Icon ? (
    <Icon className={styles.icon} aria-hidden="true" />
  ) : (
    icon || <PageIcon className={styles.icon} aria-hidden="true" />
  );
};

export const SearchItem = ({ searchItem }: SearchItemProps) => {
  const { id, icon, title, description, lastTimeEdited, path } = searchItem;

  return (
    <Card className={styles.searchCard} variant="outlined">
      <Link className={styles.selectButton} href={`${ROUTES.documents}/${id}`}>
        <span className={styles.iconWrapper}>{renderSearchIcon(icon)}</span>

        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          <Typography variant="caption">{path}</Typography>
          {description && <span className={styles.description}>{description}</span>}
        </span>

        <Typography
          className={styles.editedTime}
          variant="caption"
          title="Последнее изменение"
          aria-label={`Последнее изменение: ${lastTimeEdited}`}
        >
          {lastTimeEdited}
        </Typography>
      </Link>
    </Card>
  );
};
