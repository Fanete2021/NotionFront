'use client';

import styles from './Project.module.css';
import { ProjectWorkspace } from '@widgets/project/workspace';
import { ProjectDocument } from '@widgets/project/document';
import { Typography } from '@shared/ui/Typography';

export const ProjectPage = () => {
  return (
    <ProjectWorkspace>
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
  );
};
