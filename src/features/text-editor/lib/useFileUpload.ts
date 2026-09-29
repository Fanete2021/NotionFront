import { ReactNodeViewProps } from '@tiptap/react';
import { useContext, useState } from 'react';
import { UploadFileContext } from '../model/uploadFileContext';
import { toast } from '@shared/ui/toast';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';

const getUploadErrorTitle = (error: unknown) => {
  if (isFetchBaseQueryError(error)) {
    if (error.status === HTTP_STATUS.PAYLOAD_TOO_LARGE) return 'Файл слишком большой';
    if (error.status === HTTP_STATUS.BAD_REQUEST) return 'Неподдерживаемый формат файла';
  }
  return 'Не удалось загрузить файл';
};

export const useFileUpload = (props: ReactNodeViewProps, nodeType: 'image' | 'video') => {
  const upload = useContext(UploadFileContext);
  const [isUploading, setIsUploading] = useState(false);

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

    setIsUploading(true);
    try {
      replaceWithMedia(await upload(file));
    } catch (error) {
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
