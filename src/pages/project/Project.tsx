'use client';

import { Typography } from '@shared/ui/Typography';
import styles from './Project.module.css';
import { ProjectWorkspace } from '@widgets/project-workspace';
import { CommentsSidebar } from '@widgets/comments-sidebar';
import { ProjectDocument } from '@widgets/project-document';
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

        <ProjectDocument />
      </main>
    </ProjectWorkspace>
  )
};
