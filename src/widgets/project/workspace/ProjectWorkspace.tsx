'use client';

import { useState } from 'react';
import { ProjectHeader } from '@widgets/project/header';
import { ProjectComments } from '@widgets/project/comments';
import { ChangeVersionModal } from '@features/projects/change-version';
import styles from './ProjectWorkspace.module.css';

type ProjectWorkspaceProps = {
  children: React.ReactNode;
};

export const ProjectWorkspace = ({ children }: ProjectWorkspaceProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader
          onCommentsClick={() => setIsCommentsOpen((open) => !open)}
          onHistoryClick={() => setIsHistoryOpen(true)}
        />
        <div className={styles.content}>{children}</div>
      </div>
      {isCommentsOpen ? <ProjectComments onClose={() => setIsCommentsOpen(false)} /> : null}
      <ChangeVersionModal open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};
