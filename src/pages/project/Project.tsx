'use client';

import styles from './Project.module.css';
import { ProjectWorkspace, ProjectDocument } from '@/widgets/project';
import { Typography } from '@shared/ui/Typography';

const MOCK_BREADCRUMBS = ['Документы', 'Дизайн-система', 'Компоненты'];

export const ProjectPage = () => {
  return (
    <ProjectWorkspace breadcrumbs={MOCK_BREADCRUMBS}>
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
