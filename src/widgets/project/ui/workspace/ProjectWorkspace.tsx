'use client';

import { useState } from 'react';
import { ProjectHeader } from '../header/ProjectHeader';
import { ProjectComments } from '../comments/ProjectComments';
import styles from './ProjectWorkspace.module.css';
import { ChangeVersionModal } from '@/features/change-version';

type ProjectWorkspaceProps = {
  children: React.ReactNode;
  breadcrumbs: string[];
  pageId: string;
};

export const ProjectWorkspace = ({ children, breadcrumbs, pageId }: ProjectWorkspaceProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader
          breadcrumbs={breadcrumbs}
          onCommentsClick={() => setIsCommentsOpen((open) => !open)}
          onHistoryClick={() => setIsHistoryOpen(true)}
          pageId={pageId}
        />
        <div className={styles.content}>{children}</div>
      </div>
      {isCommentsOpen ? <ProjectComments onClose={() => setIsCommentsOpen(false)} /> : null}
      <ChangeVersionModal open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};
