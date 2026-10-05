'use client';

import styles from './DocumentHeader.module.css';
import { useGetPageVersionsQuery } from '@/entities/page';
import { useGetWorkspaceMembersQuery } from '@/entities/workspace-members';
import { useGetMeQuery } from '@/entities/user';
import type { Page } from '@/shared/const/pageType';
import { formatRelativeTime } from '@/shared/lib/format-relative-time/formatRelativeTime';
import { Typography } from '@/shared/ui/Typography';
import { getIconByName } from '@/shared/ui/icon-picker';

interface DocumentHeaderProps {
  page: Page;
  updatedAt?: string;
  saveError?: string | null;
  isSaving?: boolean;
}

const renderPageIcon = (icon: string | null | undefined, className: string) => {
  const Icon = getIconByName(icon);
  return Icon ? <Icon className={className} /> : null;
};

export const DocumentHeader = ({ page, updatedAt, saveError, isSaving }: DocumentHeaderProps) => {
  const { data: versions } = useGetPageVersionsQuery(page.id, {
    skip: !page.id,
  });

  const { data: members } = useGetWorkspaceMembersQuery(page.workspaceId, {
    skip: !page.workspaceId,
  });

  const { data: authData } = useGetMeQuery();

  const latestVersion = versions?.items?.[0];
  const editorId = latestVersion?.authorId ?? page.authorId ?? '';

  const editorName =
    members?.find((m) => m.userInfo.id === editorId)?.userInfo.name ??
    authData?.name ??
    'Неизвестный';

  const editedAt = updatedAt ?? latestVersion?.createdAt ?? page.updatedAt;

  const meta = isSaving
    ? 'Сохранение…'
    : `Последнее изменение: ${editorName} · ${formatRelativeTime(editedAt)}`;

  return (
    <div className={styles.heading}>
      {renderPageIcon(page.icon, styles.pageIcon)}
      <div className={styles.headingText}>
        <Typography variant="h1" className={styles.title}>
          {page.title}
        </Typography>
        <Typography variant="caption" className={saveError ? styles.metaError : styles.meta}>
          {saveError ?? meta}
        </Typography>
      </div>
    </div>
  );
};
