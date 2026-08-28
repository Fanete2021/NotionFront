import { mergeAttributes, Node } from '@tiptap/core';

export default Node.create({
  name: 'video',

  group: 'block',
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
      },

      poster: {
        default: null,
        parseHTML: (element) => element.getAttribute('poster'),
      },

      controls: {
        default: true,
        parseHTML: (element) => element.getAttribute('controls'),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)];
  },
});
