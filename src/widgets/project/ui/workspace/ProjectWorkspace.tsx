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
  const comments = usePageComments();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPublicationOpen, setIsPublicationOpen] = useState(false);
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader
          breadcrumbs={breadcrumbs}
          isCommentsOpen={comments.isOpen}
          commentsCount={comments.openThreadsCount}
          onCommentsClick={comments.toggle}
          onHistoryClick={() => setIsHistoryOpen(true)}
          onPublishClick={() => setIsPublicationOpen(true)}
        />
        <div className={styles.content}>{children}</div>
      </div>
      {comments.isOpen ? <ProjectComments /> : null}
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

// Комментарии нужны и шапке, и панели, и редактору внутри children — поэтому провайдер здесь.
export const ProjectWorkspace = (props: ProjectWorkspaceProps) => (
  <PageCommentsProvider key={props.page.id} pageId={props.page.id}>
    <WorkspaceLayout {...props} />
  </PageCommentsProvider>
);
