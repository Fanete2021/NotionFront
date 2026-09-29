import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { FileDropzone } from '@features/text-editor/ui/file-dropzone/FileDropzone';
import { useFileUpload } from '@features/text-editor/lib/useFileUpload';

const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 ** 2;

export const ImageUploadNodeView = (props: ReactNodeViewProps) => {
  const { handleFileSelect, isUploading } = useFileUpload(props, 'image');

  return (
    <NodeViewWrapper contentEditable={false}>
      <FileDropzone
        onFileSelect={handleFileSelect}
        maxFileSize={MAX_FILE_SIZE}
        hint={
          isUploading ? 'Загрузка…' : 'Перетащите изображение сюда или нажмите, чтобы загрузить'
        }
        acceptedExtensions={ACCEPTED_EXTENSIONS}
        formatsLabel="PNG, JPG, GIF, WEBP"
        disabled={isUploading}
      />
    </NodeViewWrapper>
  );
};
