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
        <div className={styles.heading}>
          <span className={styles.pageIcon} aria-hidden>
            📐
          </span>
          <div className={styles.headingText}>
            <Typography variant="h1" className={styles.title}>
              Дизайн-система — Компоненты
            </Typography>
            <Typography variant="caption" className={styles.meta}>
              Последнее изменение: Алекс Ким · 2 часа назад
            </Typography>
          </div>
        </div>

        <div className={styles.document}>
          <ProjectDocument />
        </div>
      </main>
    </ProjectWorkspace>
  )
};
