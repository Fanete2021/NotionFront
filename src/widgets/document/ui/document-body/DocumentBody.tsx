'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DocumentBody.module.css';
import { formatRelativeTime } from '../../lib/formatRelativeTime';
import { TextEditor } from '@features/text-editor';
import { Page, PageContent, PageContentJson, useUpdatePageContentMutation } from '@/entities/page';
import { Typography } from '@/shared/ui/Typography';
import { getIconByName } from '@/shared/ui/icon-picker';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';
import { useDebounce } from '@/shared/lib';

const SAVE_DELAY = 800;
const TOO_LARGE_MESSAGE = 'Документ слишком большой, изменения не сохранены';
const SAVE_ERROR_MESSAGE = 'Не удалось сохранить изменения';
const MOCK_AUTHOR = 'Алекс Ким';

const renderPageIcon = (icon: string | null | undefined, className: string) => {
  const Icon = getIconByName(icon);

  return Icon ? <Icon className={className} /> : null;
};

type DocumentBodyProps = {
  page: Page;
  content: PageContent | null;
};

export const DocumentBody = ({ page, content }: DocumentBodyProps) => {
  const [updateContent] = useUpdatePageContentMutation();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(content?.updatedAt ?? page.updatedAt);

  const latestJsonRef = useRef<PageContentJson | null>(null);
  const isDirtyRef = useRef(false);

  const save = useCallback(
    async (json: PageContentJson) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        const saved = await updateContent({ id: page.id, json }).unwrap();
        isDirtyRef.current = false;
        setUpdatedAt(saved.updatedAt);
      } catch (err) {
        const isTooLarge =
          isFetchBaseQueryError(err) && err.status === HTTP_STATUS.PAYLOAD_TOO_LARGE;
        setSaveError(isTooLarge ? TOO_LARGE_MESSAGE : SAVE_ERROR_MESSAGE);
      } finally {
        setIsSaving(false);
      }
    },
    [page.id, updateContent],
  );

  const debouncedSave = useDebounce(save, SAVE_DELAY);

  const handleChange = (json: PageContentJson) => {
    latestJsonRef.current = json;
    isDirtyRef.current = true;
    debouncedSave(json);
  };

  useEffect(() => {
    return () => {
      if (isDirtyRef.current && latestJsonRef.current) {
        updateContent({ id: page.id, json: latestJsonRef.current });
      }
    };
  }, [page.id, updateContent]);

  const meta = isSaving
    ? 'Сохранение…'
    : `Последнее изменение: ${MOCK_AUTHOR} · ${formatRelativeTime(updatedAt)}`;

  return (
    <main className={styles.main}>
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

      <div className={styles.document}>
        <TextEditor content={content?.json ?? null} onChange={handleChange} />
      </div>
    </main>
  );
};
