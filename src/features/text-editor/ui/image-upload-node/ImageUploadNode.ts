import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageUploadNodeView } from '@features/text-editor/ui/image-upload-node/ImageUploadNodeView';

export default Node.create({
  name: 'imageUpload',

  group: 'block',
  draggable: false,

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'image-upload',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-upload', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadNodeView, {
      stopEvent: ({ event }) => {
        if (!event.target) return false;
        const target = event.target;

        if (target instanceof Element) {
          const isInsideIsolatedBlock = target.closest('[data-isolate-block="true"]');

          return !!isInsideIsolatedBlock;
        }

        return false;
      },
    });
  },
});
