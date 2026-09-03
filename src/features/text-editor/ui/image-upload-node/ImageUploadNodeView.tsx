import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { FileDropzone } from '@features/text-editor/ui/file-dropzone/FileDropzone';

const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];
const MAX_FILE_SIZE = 10 * 1024 ** 2;

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
        maxFileSize={MAX_FILE_SIZE}
        hint="Перетащите изображение сюда или нажмите, чтобы загрузить"
        acceptedExtensions={ACCEPTED_EXTENSIONS}
        formatsLabel="PNG, JPG, GIF"
      />
    </NodeViewWrapper>
  );
};
