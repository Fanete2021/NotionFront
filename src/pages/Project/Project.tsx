'use client';

import { Typography } from '@shared/ui/Typography';
import styles from './Project.module.css';
import { ProjectWorkspace } from '@widgets/ProjectWorkspace';
import { CommentsSidebar } from '@widgets/CommentsSidebar';
import { useState } from 'react';

export const ProjectPage = () => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <ProjectWorkspace
      onCommentsClick={() => setIsCommentsOpen((open) => !open)}
      sidebar={
        isCommentsOpen ? (
          <CommentsSidebar onClose={() => setIsCommentsOpen(false)} />
        ) : null
      }
    >
      <main className={styles.main}>
        <Typography variant="h1">
          Дизайн-система — Компоненты
        </Typography>
        <Typography variant="caption">
          Последнее изменение: Алекс Ким · 2 часа назад
        </Typography>

        <Typography variant="h2">Обзор</Typography>
        <Typography variant="text-regular">
          Здесь собраны базовые UI-компоненты дизайн-системы: кнопки, поля ввода и типографика.
        </Typography>

        <Typography variant="h2">Кнопки</Typography>
        <Typography variant="text-regular">
          Кнопка — основной элемент действий. Варианты: primary, secondary и ghost.
        </Typography>
      </main>
    </ProjectWorkspace>
  )
};
