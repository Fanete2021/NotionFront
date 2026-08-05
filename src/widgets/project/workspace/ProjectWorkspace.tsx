'use client';

import { useState } from 'react';
import { ProjectHeader } from '@widgets/project/header';
import { ProjectComments } from '@widgets/project/comments';
import styles from './ProjectWorkspace.module.css';

type ProjectWorkspaceProps = {
  children: React.ReactNode;
};

export const ProjectWorkspace = ({ children }: ProjectWorkspaceProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader onCommentsClick={() => setIsCommentsOpen((open) => !open)} />
        <div className={styles.content}>{children}</div>
      </div>
      {isCommentsOpen ? <ProjectComments onClose={() => setIsCommentsOpen(false)} /> : null}
    </div>
  );
};
