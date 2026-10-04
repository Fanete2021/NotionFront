import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { FileDropzone } from '@features/text-editor/ui/file-dropzone/FileDropzone';
import { useFileUpload } from '@features/text-editor/lib/useFileUpload';

const ACCEPTED_EXTENSIONS = ['.mp4', '.webm', '.mov'];
const MAX_FILE_SIZE = 100 * 1024 ** 2;

export const VideoUploadNodeView = (props: ReactNodeViewProps) => {
  const { handleFileSelect, isUploading } = useFileUpload(props, 'video');

  return (
    <NodeViewWrapper contentEditable={false}>
      <FileDropzone
        onFileSelect={handleFileSelect}
        maxFileSize={MAX_FILE_SIZE}
        hint={isUploading ? 'Загрузка…' : 'Вставьте ссылку (YouTube, Vimeo) или загрузите файл'}
        acceptedExtensions={ACCEPTED_EXTENSIONS}
        formatsLabel="MP4, MOV, WEBM"
        disabled={isUploading}
      />
    </NodeViewWrapper>
  );
};
