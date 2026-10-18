'use client';

import { useParams } from 'next/navigation';
import { ArticleNotFound } from './ArticleNotFound';
import { ArticleView } from '@widgets/article-view';
import { ArticleContent } from '@widgets/article-content';
import { PublicHeader } from '@widgets/public-header';
import { UnexpectedError } from '@widgets/error';
import { useGetArticleSlugQuery } from '@entities/published-document';
import { HTTP_STATUS } from '@shared/const/httpStatus';
import { isFetchBaseQueryError } from '@shared/utils/error-utils';
import { Loader } from '@shared/ui/loader';

export const ArticleViewPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const {
    currentData: document,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetArticleSlugQuery({ slug }, { skip: !slug });

  if (!slug || (isFetchBaseQueryError(error) && error.status === HTTP_STATUS.NOT_FOUND)) {
    return <ArticleNotFound />;
  }

  return (
    <>
      <PublicHeader />
      {isFetching && !document ? (
        <Loader text="Загрузка статьи..." />
      ) : isError || !document ? (
        <UnexpectedError
          code="PUBLIC ARTICLE"
          error={new Error('Не удалось загрузить статью')}
          onRetry={() => void refetch()}
        />
      ) : (
        <ArticleView document={document}>
          <ArticleContent content={document.content.json} />
        </ArticleView>
      )}
    </>
  );
};
