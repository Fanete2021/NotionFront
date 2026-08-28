import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VideoUploadNodeView } from '@features/text-editor/ui/video-upload-node/VideoUploadNodeView';

export default Node.create({
  name: 'videoUpload',

  group: 'block',

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'video-upload',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video-upload', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadNodeView, {
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
