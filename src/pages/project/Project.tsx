'use client';

import styles from './Project.module.css';
import { ProjectWorkspace, ProjectDocument } from '@/widgets/project';
import { DocumentHeader } from '@/widgets/document';
import { useGetPageByIdQuery } from '@/entities/page';

interface ProjectPageProps {
  pageId: string;
  breadcrumbs: string[];
}

export const ProjectPage = ({ pageId, breadcrumbs }: ProjectPageProps) => {
  const { data: page } = useGetPageByIdQuery(pageId);

  if (!page) return null;

  return (
    <ProjectWorkspace breadcrumbs={breadcrumbs}>
      <main className={styles.main}>
        <DocumentHeader page={page} />
        <div className={styles.document}>
          <ProjectDocument />
        </div>
      </main>
    </ProjectWorkspace>
  );
};
