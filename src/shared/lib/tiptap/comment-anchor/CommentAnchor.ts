import { Mark, type Editor } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import {
  COMMENT_ANCHOR_ATTRIBUTE,
  COMMENT_ANCHOR_MARK,
  findCommentAnchorRanges,
} from './commentAnchorUtils';

export type CommentHighlights = {
  anchorIds: string[];
  activeAnchorId: string | null;
};

type CommentAnchorOptions = {
  highlightClass: string;
  activeClass: string;
};

/** Обработчик клика меняется вместе с компонентом, поэтому он в storage, а не в options. */
type CommentAnchorStorage = {
  onAnchorClick: ((anchorId: string) => void) | null;
};

type HighlightState = {
  anchorIds: ReadonlySet<string>;
  activeAnchorId: string | null;
  decorations: DecorationSet;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    commentAnchor: {
      setCommentAnchor: (anchorId: string) => ReturnType;
      unsetCommentAnchor: (anchorId: string) => ReturnType;
      setCommentHighlights: (highlights: CommentHighlights) => ReturnType;
    };
  }

  interface Storage {
    commentAnchor: CommentAnchorStorage;
  }
}

const highlightKey = new PluginKey<HighlightState>('commentAnchorHighlight');

/**
 * Задаёт, что делать при клике по подсвеченному якорю.
 * У уничтоженного редактора storage пустой — тогда ничего не делаем.
 */
export const setCommentAnchorClickHandler = (
  editor: Editor,
  handler: ((anchorId: string) => void) | null,
): void => {
  const storage = editor.storage.commentAnchor as CommentAnchorStorage | undefined;
  if (storage) storage.onAnchorClick = handler;
};

const buildDecorations = (
  doc: PmNode,
  anchorIds: ReadonlySet<string>,
  activeAnchorId: string | null,
  options: CommentAnchorOptions,
): DecorationSet => {
  if (anchorIds.size === 0) return DecorationSet.empty;

  const decorations: Decoration[] = [];

  doc.descendants((node, pos) => {
    if (!node.isText) return;

    for (const mark of node.marks) {
      if (mark.type.name !== COMMENT_ANCHOR_MARK) continue;

      const anchorId = mark.attrs.anchorId as string;
      if (!anchorIds.has(anchorId)) continue;

      const className =
        anchorId === activeAnchorId
          ? `${options.highlightClass} ${options.activeClass}`
          : options.highlightClass;
      decorations.push(Decoration.inline(pos, pos + node.nodeSize, { class: className }));
    }
  });

  return DecorationSet.create(doc, decorations);
};

/**
 * Якорь комментария к фрагменту текста. Сама марка ничего не рисует:
 * подсвечиваются только якоря из setCommentHighlights, то есть с открытыми комментариями.
 */
export const CommentAnchor = Mark.create<CommentAnchorOptions, CommentAnchorStorage>({
  name: COMMENT_ANCHOR_MARK,

  inclusive: false,

  // Разрешаем пересекаться якорям разных комментариев на одном тексте.
  excludes: '',

  addOptions() {
    return {
      highlightClass: '',
      activeClass: '',
    };
  },

  addStorage() {
    return {
      onAnchorClick: null,
    };
  },

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
        ({ state, tr, dispatch }) => {
          const { from, to, empty } = state.selection;
          if (empty) return false;

          if (dispatch) tr.addMark(from, to, this.type.create({ anchorId }));
          return true;
        },

      unsetCommentAnchor:
        (anchorId) =>
        ({ state, tr, dispatch }) => {
          const ranges = findCommentAnchorRanges(state.doc, anchorId);
          if (ranges.length === 0) return false;

          if (dispatch) {
            for (const { from, to, mark } of ranges) tr.removeMark(from, to, mark);
          }
          return true;
        },

      setCommentHighlights:
        (highlights) =>
        ({ tr, dispatch }) => {
          if (dispatch) tr.setMeta(highlightKey, highlights).setMeta('addToHistory', false);
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    const storage = this.storage;

    return [
      new Plugin<HighlightState>({
        key: highlightKey,
        state: {
          init: () => ({
            anchorIds: new Set(),
            activeAnchorId: null,
            decorations: DecorationSet.empty,
          }),
          apply: (tr, value, _oldState, newState) => {
            const meta = tr.getMeta(highlightKey) as CommentHighlights | undefined;
            if (!meta && !tr.docChanged) return value;

            const anchorIds = meta ? new Set(meta.anchorIds) : value.anchorIds;
            const activeAnchorId = meta ? meta.activeAnchorId : value.activeAnchorId;

            return {
              anchorIds,
              activeAnchorId,
              decorations: buildDecorations(newState.doc, anchorIds, activeAnchorId, options),
            };
          },
        },
        props: {
          decorations: (state) => highlightKey.getState(state)?.decorations,
          handleDOMEvents: {
            // Обычный клик, а не handleClick: он срабатывает и в режиме только чтения.
            click: (view, event) => {
              const { onAnchorClick } = storage;
              if (!onAnchorClick || !(event.target instanceof Element)) return false;

              const highlighted = highlightKey.getState(view.state)?.anchorIds;
              let element = event.target.closest(`[${COMMENT_ANCHOR_ATTRIBUTE}]`);

              // Якоря могут быть вложены — берём самый внутренний подсвеченный.
              while (element && view.dom.contains(element)) {
                const anchorId = element.getAttribute(COMMENT_ANCHOR_ATTRIBUTE);
                if (anchorId && highlighted?.has(anchorId)) {
                  onAnchorClick(anchorId);
                  break;
                }
                element = element.parentElement?.closest(`[${COMMENT_ANCHOR_ATTRIBUTE}]`) ?? null;
              }

              return false;
            },
          },
        },
      }),
    ];
  },
});
