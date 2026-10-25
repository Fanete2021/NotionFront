'use client';

import { ReactNode, useState } from 'react';
import { ProjectHeader } from '../header/ProjectHeader';
import { ProjectComments } from '../comments/ProjectComments';
import styles from './ProjectWorkspace.module.css';
import { ChangeVersionModal } from '@/features/change-version';
import { PageCommentsProvider, usePageComments } from '@features/page-comments';
import { PublishPageModal } from '@features/publish-page';
import type { PageContent } from '@/entities/page';
import type { Page } from '@/shared/const/pageType';

type ProjectWorkspaceProps = {
  children: ReactNode;
  breadcrumbs: string[];
  page: Page;
  onVersionRestored?: (content: PageContent) => void;
};

const WorkspaceLayout = ({
  children,
  breadcrumbs,
  page,
  onVersionRestored,
}: ProjectWorkspaceProps) => {
  const { state, actions } = usePageComments();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPublicationOpen, setIsPublicationOpen] = useState(false);
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader
          breadcrumbs={breadcrumbs}
          onCommentsClick={actions.toggle}
          onHistoryClick={() => setIsHistoryOpen(true)}
          onPublishClick={() => setIsPublicationOpen(true)}
        />
        <div className={styles.content}>{children}</div>
      </div>
      {state.isOpen && <ProjectComments />}
      <ChangeVersionModal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        page={page}
        onRestored={onVersionRestored}
      />
      <PublishPageModal
        isOpen={isPublicationOpen}
        onClose={() => setIsPublicationOpen(false)}
        page={page}
      />
    </div>
  );
};

export const ProjectWorkspace = (props: ProjectWorkspaceProps) => (
  <PageCommentsProvider key={props.page.id} pageId={props.page.id}>
    <WorkspaceLayout {...props} />
  </PageCommentsProvider>
);
