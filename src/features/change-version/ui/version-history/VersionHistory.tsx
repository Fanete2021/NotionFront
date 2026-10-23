'use client';

import { useState } from 'react';
import { VersionList } from '../version-list/VersionList';
import { VersionPreview } from '../version-preview/VersionPreview';
import { formatVersionFullDate } from '../../lib/formatVersionDate';
import type { VersionItem } from '../../model/version.types';
import {
  type PageContent,
  useGetPageVersionsInfiniteQuery,
  useRestorePageVersionMutation,
} from '@/entities/page';
import { useGetWorkspaceMembersQuery } from '@/entities/workspace-members';
import { useGetMeQuery } from '@/entities/user';
import type { Page } from '@/shared/const/pageType';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';
import { toast } from '@shared/ui/toast';

const UNKNOWN_AUTHOR = 'Неизвестный';

const getRestoreErrorMessage = (error: unknown) => {
  if (isFetchBaseQueryError(error)) {
    if (error.status === HTTP_STATUS.FORBIDDEN) {
      return 'Недостаточно прав, чтобы восстановить версию';
    }
    if (error.status === HTTP_STATUS.NOT_FOUND) {
      return 'Версия не найдена. Откройте историю заново и попробуйте ещё раз';
    }
  }

  return 'Не удалось восстановить версию';
};

type VersionHistoryProps = {
  page: Page;
  onRestored: (content: PageContent) => void;
};

export const VersionHistory = ({ page, onRestored }: VersionHistoryProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useGetPageVersionsInfiniteQuery(page.id, { refetchOnMountOrArgChange: true });

  const { data: members } = useGetWorkspaceMembersQuery(page.workspaceId);
  const { data: me } = useGetMeQuery();
  const [restoreVersion, { isLoading: isRestoring }] = useRestorePageVersionMutation();

  const getAuthorName = (authorId: string) => {
    const member = members?.find(({ userInfo }) => userInfo.id === authorId);

    if (member) return member.userInfo.name;
    if (me?.id === authorId) return me.name;

    return UNKNOWN_AUTHOR;
  };

  const versions: VersionItem[] = (data?.pages ?? [])
    .flatMap(({ items }) => items)
    .map(({ id, createdAt, authorId, preview }) => ({
      id,
      createdAt,
      authorName: getAuthorName(authorId),
      preview,
    }));

  const selectedVersion = versions.find(({ id }) => id === selectedId) ?? versions[0] ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setRestoreError(null);
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;

    setRestoreError(null);

    try {
      const content = await restoreVersion({
        versionId: selectedVersion.id,
        pageId: page.id,
      }).unwrap();

      toast.add({
        type: 'success',
        title: 'Версия восстановлена',
        description: `Документ возвращён к состоянию на ${formatVersionFullDate(selectedVersion.createdAt)}`,
      });
      onRestored(content);
    } catch (error) {
      setRestoreError(getRestoreErrorMessage(error));
    }
  };

  return (
    <>
      <VersionList
        versions={versions}
        selectedId={selectedVersion?.id ?? null}
        onSelect={handleSelect}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
      <VersionPreview
        page={page}
        version={selectedVersion}
        isRestoring={isRestoring}
        error={restoreError}
        onRestore={() => void handleRestore()}
      />
    </>
  );
};
