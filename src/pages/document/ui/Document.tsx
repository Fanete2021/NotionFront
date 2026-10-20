'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DocumentBody, DocumentBodySkeleton } from '@widgets/document';
import { ProjectWorkspace } from '@widgets/project';
import { NotFoundError, UnexpectedError } from '@widgets/error';
import { type PageContent, useGetPageByIdQuery, useGetPageContentQuery } from '@entities/page';
import { useGetProjectByIdQuery } from '@entities/project';
import { HTTP_STATUS } from '@shared/const/httpStatus';
import { isFetchBaseQueryError } from '@shared/utils/error-utils';

export const DocumentPage = () => {
  const params = useParams<{ id: string }>();
  const documentId = params?.id ?? '';
  const [restoredContent, setRestoredContent] = useState<PageContent | null>(null);

  const pageQuery = useGetPageByIdQuery(documentId, { skip: !documentId });
  const contentQuery = useGetPageContentQuery(documentId, { skip: !documentId });

  const projectId = pageQuery.data?.projectId ?? '';
  const projectQuery = useGetProjectByIdQuery(projectId, { skip: !projectId });

  if (pageQuery.isLoading) {
    return (
      <ProjectWorkspace breadcrumbs={[]} page={null} onVersionRestored={setRestoredContent}>
        <DocumentBodySkeleton />
      </ProjectWorkspace>
    );
  }

  if (pageQuery.isError) {
    const isNotFound =
      isFetchBaseQueryError(pageQuery.error) && pageQuery.error.status === HTTP_STATUS.NOT_FOUND;

    if (isNotFound) return <NotFoundError />;

    return (
      <UnexpectedError
        code={HTTP_STATUS.INTERNAL_SERVER_ERROR}
        error={new Error('Не удалось загрузить документ')}
        onRetry={() => void pageQuery.refetch()}
      />
    );
  }

  if (!pageQuery.data) return <NotFoundError />;

  const isContentMissing =
    isFetchBaseQueryError(contentQuery.error) &&
    contentQuery.error.status === HTTP_STATUS.NOT_FOUND;

  if (contentQuery.isError && !isContentMissing) {
    return (
      <UnexpectedError
        code={HTTP_STATUS.INTERNAL_SERVER_ERROR}
        error={new Error('Не удалось загрузить содержимое документа')}
        onRetry={() => void contentQuery.refetch()}
      />
    );
  }

  const breadcrumbs = ['Документы', projectQuery.data?.name, pageQuery.data.title].filter(
    (crumb): crumb is string => Boolean(crumb),
  );

  const restored = restoredContent?.pageId === documentId ? restoredContent : null;

  return (
    <ProjectWorkspace
      breadcrumbs={breadcrumbs}
      page={pageQuery.data}
      onVersionRestored={setRestoredContent}
    >
      {contentQuery.isLoading ? (
        <DocumentBodySkeleton />
      ) : (
        <DocumentBody
          key={`${pageQuery.data.id}:${restored?.updatedAt ?? ''}`}
          page={pageQuery.data}
          content={restored ?? contentQuery.data ?? null}
        />
      )}
    </ProjectWorkspace>
  );
};
