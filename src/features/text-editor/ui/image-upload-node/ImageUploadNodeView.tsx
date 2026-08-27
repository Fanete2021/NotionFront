import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import { FileDropzone } from '@features/text-editor/ui/file-dropzone/FileDropzone';

const ImageUploadNodeView = (props: ReactNodeViewProps) => {
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
      <FileDropzone onFileSelect={handleFileSelect} />
    </NodeViewWrapper>
  );
};

export default ImageUploadNodeView;
