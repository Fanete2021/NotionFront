'use client';

import { useId } from 'react';
import styles from './ProjectFilter.module.css';
import { Typography } from '@shared/ui/Typography';
import { Select } from '@shared/ui/select';

export const ProjectFilter = () => {
  const selectId = useId();

  return (
    <div className={styles.projectFilter}>
      <Typography className={styles.title} variant="label" htmlFor={selectId}>
        Проект
      </Typography>
      <Select
        id={selectId}
        size="s"
        defaultValue=""
        options={[{ value: '', label: 'Все проекты' }]}
      />
    </div>
  );
};
