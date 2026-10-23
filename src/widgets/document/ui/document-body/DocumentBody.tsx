'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './DocumentBody.module.css';
import { DocumentHeader } from '../document-header/DocumentHeader';
import { TextEditor } from '@features/text-editor';
import { PageContent, useYjsProvider } from '@/entities/page';
import { useUploadAttachment } from '@/entities/attachment';
import { useGetMeQuery } from '@/entities/user';
import { useGetWorkspaceMembersQuery } from '@/entities/workspace-members';
import { Page } from '@/shared/const/pageType';

type DocumentBodyProps = {
  page: Page;
  content: PageContent | null;
};

const CURSOR_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#2563EB', '#8B5CF6'];

const pickColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
};

export const DocumentBody = ({ page, content }: DocumentBodyProps) => {
  const { data: authData } = useGetMeQuery();

  const { data: members } = useGetWorkspaceMembersQuery(page.workspaceId, {
    skip: !page.workspaceId,
  });

  const user = useMemo(
    () => (authData ? { name: authData.name, color: pickColor(authData.id) } : null),
    [authData],
  );

  const provider = useYjsProvider(page.id, { user });
  const uploadAttachment = useUploadAttachment(page.id);

  const [canEdit, setCanEdit] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    if (!provider) {
      // eslint-disable-next-line
      setCanEdit(false);
      setIsSynced(false);
      return;
    }

    setCanEdit(provider.canEdit);
    setIsSynced(provider.isSynced);

    const unsubCanEdit = provider.onCanEditChange(setCanEdit);
    const unsubSynced = provider.onSyncedChange(setIsSynced);

    return () => {
      unsubCanEdit();
      unsubSynced();
    };
  }, [provider]);

  const editable = canEdit && isSynced;

  const serverUpdatedAt = content?.updatedAt ?? page.updatedAt;

  const authorId = page.authorId ?? authData?.id ?? '';
  const authorName =
    members?.find((m) => m.userInfo.id === authorId)?.userInfo.name ??
    authData?.name ??
    'Неизвестный';

  return (
    <main className={styles.main}>
      <DocumentHeader page={page} updatedAt={serverUpdatedAt} authorName={authorName} />
      <div className={styles.document}>
        <TextEditor
          provider={provider}
          user={user}
          editable={editable}
          content={content?.json ?? null}
          onUploadFile={uploadAttachment}
        />
      </div>
    </main>
  );
};
