import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { FileDropzone } from '@features/text-editor/ui/file-dropzone/FileDropzone';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const VideoUploadNodeView = (props: ReactNodeViewProps) => {
  const handleFileSelect = (file: File) => {
    const position = props.getPos();

    if (typeof position !== 'number') {
      return;
    }

    const src = URL.createObjectURL(file);

    props.editor
      .chain()
      .insertContentAt(
        {
          from: position,
          to: position + props.node.nodeSize,
        },
        {
          type: 'video',
          attrs: {
            src,
          },
        },
      )
      .run();
  };
  return (
    <NodeViewWrapper contentEditable={false}>
      <FileDropzone
        onFileSelect={handleFileSelect}
        fileSize={MAX_FILE_SIZE}
        hint="Вставьте ссылку (YouTube, Vimeo) или загрузите файл"
        fileExtensionsHint="MP4, MOV, WEBM до 100 МБ"
        allowedFileType="video/"
      />
    </NodeViewWrapper>
  );
};
