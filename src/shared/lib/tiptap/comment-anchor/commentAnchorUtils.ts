import type { Mark, Node as PmNode } from '@tiptap/pm/model';

export const COMMENT_ANCHOR_MARK = 'commentAnchor';
export const COMMENT_ANCHOR_ATTRIBUTE = 'data-comment-anchor';

const SAFE_ANCHOR_ID = /^[\w-]+$/;

const getAnchorId = (mark: Mark): string | null =>
  mark.type.name === COMMENT_ANCHOR_MARK ? (mark.attrs.anchorId as string | null) : null;

export const findCommentAnchorRanges = (doc: PmNode, anchorId: string) => {
  const ranges: { from: number; to: number; mark: Mark }[] = [];

  doc.descendants((node, pos) => {
    const mark = node.marks.find((item) => getAnchorId(item) === anchorId);
    if (node.isText && mark) ranges.push({ from: pos, to: pos + node.nodeSize, mark });
  });

  return ranges;
};

export const collectCommentAnchorTexts = (doc: PmNode): Record<string, string> => {
  const texts: Record<string, string> = {};
  const lastEnd: Record<string, number> = {};

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;

    for (const mark of node.marks) {
      const anchorId = getAnchorId(mark);
      if (!anchorId) continue;

      const separator = anchorId in texts && lastEnd[anchorId] !== pos ? ' ' : '';
      texts[anchorId] = (texts[anchorId] ?? '') + separator + node.text;
      lastEnd[anchorId] = pos + node.nodeSize;
    }
  });

  return texts;
};

export const getCommentAnchorsSelector = (anchorIds: string[]): string =>
  anchorIds
    .filter((anchorId) => SAFE_ANCHOR_ID.test(anchorId))
    .map((anchorId) => `[${COMMENT_ANCHOR_ATTRIBUTE}="${anchorId}"]`)
    .join(', ');
