'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './DocumentBody.module.css';
import { DocumentHeader } from '../document-header/DocumentHeader';
import { TextEditor } from '@features/text-editor';
import { PageContent, useYjsProvider } from '@/entities/page';
import { useUploadAttachment } from '@/entities/attachment';
import { useGetMeQuery } from '@/entities/user';
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

  const user = useMemo(
    () => (authData ? { name: authData.name, color: pickColor(authData.id) } : null),
    [authData],
  );

  const provider = useYjsProvider(page.id, { user });
  const uploadAttachment = useUploadAttachment(page.id);

  const [canEdit, setCanEdit] = useState(false);
  const [lastEditedAt, setLastEditedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!provider) {
      // eslint-disable-next-line
      setCanEdit(false);
      return;
    }
    setCanEdit(provider.canEdit);
    return provider.onCanEditChange(setCanEdit);
  }, [provider]);

  useEffect(() => {
    if (!provider) return;

    const onUpdate = (_update: Uint8Array, origin: unknown) => {
      if (origin === 'remote') return;
      setLastEditedAt(new Date().toISOString());
    };

    provider.doc.on('update', onUpdate);
    return () => {
      provider.doc.off('update', onUpdate);
    };
  }, [provider]);

  return (
    <main className={styles.main}>
      <DocumentHeader page={page} updatedAt={lastEditedAt ?? undefined} />
      <div className={styles.document}>
        <TextEditor
          provider={provider}
          user={user}
          editable={canEdit}
          content={content?.json ?? null}
          onUploadFile={uploadAttachment}
        />
      </div>
    </main>
  );
};
