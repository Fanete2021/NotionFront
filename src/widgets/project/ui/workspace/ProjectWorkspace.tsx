'use client';

import { ReactNode, useState } from 'react';
import { ProjectHeader } from '../header/ProjectHeader';
import { ProjectComments } from '../comments/ProjectComments';
import styles from './ProjectWorkspace.module.css';
import { ChangeVersionModal } from '@/features/change-version';
import type { PageContent } from '@/entities/page';
import type { Page } from '@/shared/const/pageType';

type ProjectWorkspaceProps = {
  children: ReactNode;
  breadcrumbs: string[];
  page: Page | null;
  onVersionRestored?: (content: PageContent) => void;
};

export const ProjectWorkspace = ({
  children,
  breadcrumbs,
  page,
  onVersionRestored,
}: ProjectWorkspaceProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader
          breadcrumbs={breadcrumbs}
          onCommentsClick={() => setIsCommentsOpen((open) => !open)}
          onHistoryClick={() => setIsHistoryOpen(true)}
        />
        <div className={styles.content}>{children}</div>
      </div>
      {isCommentsOpen ? <ProjectComments onClose={() => setIsCommentsOpen(false)} /> : null}
      <ChangeVersionModal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        page={page}
        onRestored={onVersionRestored}
      />
    </div>
  );
};
