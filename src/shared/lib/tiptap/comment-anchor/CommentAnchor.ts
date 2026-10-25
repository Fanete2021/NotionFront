import { Mark } from '@tiptap/core';
import {
  COMMENT_ANCHOR_ATTRIBUTE,
  COMMENT_ANCHOR_MARK,
  findCommentAnchorRanges,
} from './commentAnchorUtils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    commentAnchor: {
      setCommentAnchor: (anchorId: string) => ReturnType;
      unsetCommentAnchor: (anchorId: string) => ReturnType;
    };
  }
}

export const CommentAnchor = Mark.create({
  name: COMMENT_ANCHOR_MARK,
  inclusive: false,
  excludes: '',

  addAttributes() {
    return {
      anchorId: {
        default: null,
        parseHTML: (element) => element.getAttribute(COMMENT_ANCHOR_ATTRIBUTE),
        renderHTML: (attributes) => ({ [COMMENT_ANCHOR_ATTRIBUTE]: attributes.anchorId as string }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `span[${COMMENT_ANCHOR_ATTRIBUTE}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setCommentAnchor:
        (anchorId) =>
        ({ commands }) =>
          commands.setMark(this.name, { anchorId }),

      unsetCommentAnchor:
        (anchorId) =>
        ({ state, tr, dispatch }) => {
          if (dispatch) {
            for (const { from, to, mark } of findCommentAnchorRanges(state.doc, anchorId)) {
              tr.removeMark(from, to, mark);
            }
          }
          return true;
        },
    };
  },
});
