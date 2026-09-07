'use client';

import { useParams } from 'next/navigation';
import { DocumentBody } from '@/widgets/document';
import { ProjectWorkspace } from '@/widgets/project';
import { NotFoundError, UnexpectedError } from '@widgets/error';
import { useGetPageByIdQuery, useGetPageContentQuery } from '@/entities/page';
import { useGetProjectByIdQuery } from '@/entities/project';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';
import { Loader } from '@/shared/ui/loader';

export const DocumentPage = () => {
  const params = useParams<{ id: string }>();
  const documentId = params?.id ?? '';

  const pageQuery = useGetPageByIdQuery(documentId, { skip: !documentId });
  const contentQuery = useGetPageContentQuery(documentId, { skip: !documentId });

  const projectId = pageQuery.data?.projectId ?? '';
  const projectQuery = useGetProjectByIdQuery(projectId, { skip: !projectId });

  if (pageQuery.isLoading || contentQuery.isLoading) {
    return <Loader />;
  }

  if (pageQuery.isError) {
    const isNotFound =
      isFetchBaseQueryError(pageQuery.error) && pageQuery.error.status === HTTP_STATUS.NOT_FOUND;

    if (isNotFound) {
      return <NotFoundError />;
    }

    return (
      <UnexpectedError
        code={HTTP_STATUS.INTERNAL_SERVER_ERROR}
        error={new Error('Не удалось загрузить документ')}
        onRetry={() => void pageQuery.refetch()}
      />
    );
  }

  if (!pageQuery.data) {
    return <NotFoundError />;
  }

  const breadcrumbs = ['Документы', projectQuery.data?.name, pageQuery.data.title].filter(
    (crumb): crumb is string => Boolean(crumb),
  );

  return (
    <ProjectWorkspace breadcrumbs={breadcrumbs}>
      <DocumentBody
        key={pageQuery.data.id}
        page={pageQuery.data}
        content={contentQuery.data ?? null}
      />
    </ProjectWorkspace>
  );
};
