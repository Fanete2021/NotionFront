import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { FileDropzone } from '@features/text-editor/ui/file-dropzone/FileDropzone';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ['png', 'jpeg', 'gif'];

export const ImageUploadNodeView = (props: ReactNodeViewProps) => {
  const handleFileSelect = (file: File) => {
    const position = props.getPos();

    if (typeof position !== 'number') {
      return;
    }

    const src = URL.createObjectURL(file);

    props.editor
      .chain()
      .focus()
      .insertContentAt(
        {
          from: position,
          to: position + props.node.nodeSize,
        },
        {
          type: 'image',
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
        hint="Перетащите изображение сюда или нажмите, чтобы загрузить"
        fileExtensionsHint="PNG, JPG, GIF до 10 МБ"
        allowedFileType="image/"
        allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
      />
    </NodeViewWrapper>
  );
};
