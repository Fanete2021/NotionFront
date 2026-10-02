import { ReactNodeViewProps } from '@tiptap/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { UploadFileContext } from '../model/uploadFileContext';
import { AttachmentUploadError, UPLOAD_ERROR_REASON } from '@/entities/attachment';
import { toast } from '@shared/ui/toast';

const getUploadErrorTitle = (error: unknown) => {
  if (error instanceof AttachmentUploadError) {
    if (error.reason === UPLOAD_ERROR_REASON.TOO_LARGE) return 'Файл слишком большой';
    if (error.reason === UPLOAD_ERROR_REASON.UNSUPPORTED_TYPE) {
      return 'Неподдерживаемый формат файла';
    }
  }
  return 'Не удалось загрузить файл';
};

export const useFileUpload = (props: ReactNodeViewProps, nodeType: 'image' | 'video') => {
  const upload = useContext(UploadFileContext);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Блок удалили или ушли со страницы — останавливаем загрузку
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const replaceWithMedia = (src: string) => {
    const position = props.getPos();

    if (typeof position !== 'number') {
      return;
    }

    props.editor
      .chain()
      .focus()
      .insertContentAt(
        {
          from: position,
          to: position + props.node.nodeSize,
        },
        {
          type: nodeType,
          attrs: {
            src,
          },
        },
      )
      .run();
  };

  const handleFileSelect = async (file: File) => {
    if (!upload || isUploading) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsUploading(true);
    try {
      replaceWithMedia(await upload(file, abortController.signal));
    } catch (error) {
      if (abortController.signal.aborted) return;

      toast.add({
        type: 'error',
        title: getUploadErrorTitle(error),
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { handleFileSelect, isUploading };
};
