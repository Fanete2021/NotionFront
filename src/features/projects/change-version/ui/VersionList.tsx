'use client';

import { useState } from 'react';
import classNames from 'classnames';
import styles from './VersionList.module.css';
import { Typography } from '@shared/ui/Typography';

type VersionItem = {
  id: string;
  time: string;
  author: string;
  summary: string;
};

const mockVersions: VersionItem[] = [
  { id: '1', time: 'Сегодня, 14:14', author: 'Алекс Ким', summary: 'Добавлен блок с кодом' },
  { id: '2', time: 'Сегодня, 11:52', author: 'Женя Ли', summary: 'Обновлён чеклист' },
  { id: '3', time: 'Вчера, 16:30', author: 'Марк Р.', summary: 'Изменён заголовок' },
  { id: '4', time: '12 янв., 9:00', author: 'Алекс Ким', summary: 'Страница создана' },
  { id: '5', time: '11 янв., 18:40', author: 'Женя Ли', summary: 'Поправлены отступы' },
];

export const VersionList = () => {
  const [selectedId, setSelectedId] = useState(mockVersions[0].id);

  return (
    <div className={styles.root}>
      <Typography variant="caption" className={styles.label}>
        Версии
      </Typography>
      <div className={styles.cards}>
        {mockVersions.map((version) => (
          <button
            key={version.id}
            type="button"
            className={classNames(styles.card, {
              [styles.cardSelected]: version.id === selectedId,
            })}
            onClick={() => setSelectedId(version.id)}
          >
            <Typography variant="label" className={styles.cardTitle}>
              {version.time}
            </Typography>
            <Typography variant="caption">
              {version.author} · {version.summary}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
};
