'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DocumentBody.module.css';
import { DocumentHeader } from '../document-header/DocumentHeader';
import { TextEditor } from '@features/text-editor';
import { PageContent, PageContentJson, useUpdatePageContentMutation } from '@/entities/page';
import { useUploadAttachment } from '@/entities/attachment';
import { Page } from '@/shared/const/pageType';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';
import { useDebounce } from '@/shared/lib';

const SAVE_DELAY = 800;
const TOO_LARGE_MESSAGE = 'Документ слишком большой, изменения не сохранены';
const SAVE_ERROR_MESSAGE = 'Не удалось сохранить изменения';

type DocumentBodyProps = {
  page: Page;
  content: PageContent | null;
};

export const DocumentBody = ({ page, content }: DocumentBodyProps) => {
  const [updateContent] = useUpdatePageContentMutation();
  const uploadAttachment = useUploadAttachment(page.id);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(content?.updatedAt ?? page.updatedAt);

  const latestJsonRef = useRef<PageContentJson | null>(null);
  const isDirtyRef = useRef(false);

  const save = useCallback(
    async (json: PageContentJson) => {
      setIsSaving(true);
      setSaveError(null);
      isDirtyRef.current = false;
      try {
        const saved = await updateContent({ id: page.id, json }).unwrap();
        setUpdatedAt(saved.updatedAt);
      } catch (err) {
        isDirtyRef.current = true;
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

  return (
    <main className={styles.main}>
      <DocumentHeader page={page} updatedAt={updatedAt} saveError={saveError} isSaving={isSaving} />
      <div className={styles.document}>
        <TextEditor
          content={content?.json ?? null}
          onChange={handleChange}
          onUploadFile={uploadAttachment}
        />
      </div>
    </main>
  );
};
