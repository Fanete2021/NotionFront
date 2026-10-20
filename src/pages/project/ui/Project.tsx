'use client';

import { useParams } from 'next/navigation';
import styles from './Project.module.css';
import { ProjectWorkspace, ProjectDocument } from '@widgets/project';
import { DocumentHeader, DocumentBodySkeleton } from '@/widgets/document';
import { NotFoundError } from '@/widgets/error';
import { useGetPageByIdQuery } from '@/entities/page';
import { useGetProjectByIdQuery } from '@/entities/project';

export const ProjectPage = () => {
  const params = useParams<{ id: string }>();
  const pageId = params?.id ?? '';

  const { data: page, isLoading } = useGetPageByIdQuery(pageId, { skip: !pageId });
  const projectId = page?.projectId ?? '';
  const { data: project } = useGetProjectByIdQuery(projectId, { skip: !projectId });

  if (isLoading) {
    return (
      <ProjectWorkspace breadcrumbs={[]} page={null}>
        <main className={styles.main}>
          <DocumentBodySkeleton />
        </main>
      </ProjectWorkspace>
    );
  }

  if (!page) return <NotFoundError />;

  const breadcrumbs = ['Документы', project?.name].filter((crumb): crumb is string =>
    Boolean(crumb),
  );

  return (
    <ProjectWorkspace breadcrumbs={breadcrumbs} page={page}>
      <main className={styles.main}>
        <DocumentHeader page={page} />
        <div className={styles.document}>
          <ProjectDocument />
        </div>
      </main>
    </ProjectWorkspace>
  );
};
