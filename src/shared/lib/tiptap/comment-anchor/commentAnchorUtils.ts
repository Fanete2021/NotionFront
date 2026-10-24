import type { Mark, Node as PmNode } from '@tiptap/pm/model';

export const COMMENT_ANCHOR_MARK = 'commentAnchor';
export const COMMENT_ANCHOR_ATTRIBUTE = 'data-comment-anchor';

type CommentAnchorRange = {
  from: number;
  to: number;
  mark: Mark;
};

const getAnchorId = (mark: Mark): string | null => {
  if (mark.type.name !== COMMENT_ANCHOR_MARK) return null;
  const anchorId: unknown = mark.attrs.anchorId;
  return typeof anchorId === 'string' && anchorId ? anchorId : null;
};

/** Все куски текста, помеченные якорем. Якорь может распасться на несколько кусков. */
export const findCommentAnchorRanges = (doc: PmNode, anchorId: string): CommentAnchorRange[] => {
  const ranges: CommentAnchorRange[] = [];

  doc.descendants((node, pos) => {
    if (!node.isText) return;

    const mark = node.marks.find((item) => getAnchorId(item) === anchorId);
    if (mark) ranges.push({ from: pos, to: pos + node.nodeSize, mark });
  });

  return ranges;
};

/** Текст каждого якоря в документе. Несмежные куски склеиваются через пробел. */
export const collectCommentAnchorTexts = (doc: PmNode): Record<string, string> => {
  const texts: Record<string, string> = {};
  const lastEnd = new Map<string, number>();

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;

    for (const mark of node.marks) {
      const anchorId = getAnchorId(mark);
      if (!anchorId) continue;

      const prevEnd = lastEnd.get(anchorId);
      const separator = prevEnd !== undefined && prevEnd !== pos ? ' ' : '';
      texts[anchorId] = (texts[anchorId] ?? '') + separator + node.text;
      lastEnd.set(anchorId, pos + node.nodeSize);
    }
  });

  return texts;
};

/** Новый id якоря. randomUUID есть только в защищённом контексте (https, localhost). */
export const createCommentAnchorId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

/** Прокручивает редактор к первому куску якоря. Возвращает false, если якоря нет. */
export const scrollToCommentAnchor = (root: HTMLElement, anchorId: string): boolean => {
  const element = root.querySelector(`[${COMMENT_ANCHOR_ATTRIBUTE}="${CSS.escape(anchorId)}"]`);
  if (!element) return false;

  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
};
