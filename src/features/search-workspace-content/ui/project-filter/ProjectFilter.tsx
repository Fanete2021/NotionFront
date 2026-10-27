'use client';

import { useId } from 'react';
import styles from './ProjectFilter.module.css';
import { Typography } from '@shared/ui/typography';
import { Select, type SelectOption } from '@shared/ui/select';

interface ProjectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
}

export const ProjectFilter = ({ value, onChange, options, disabled }: ProjectFilterProps) => {
  const selectId = useId();

  return (
    <div className={styles.projectFilter}>
      <Typography className={styles.title} variant="label" htmlFor={selectId}>
        Проект
      </Typography>
      <Select
        id={selectId}
        size="s"
        value={value}
        onChange={onChange}
        disabled={disabled}
        options={[{ value: '', label: 'Все проекты' }, ...options]}
      />
    </div>
  );
};
