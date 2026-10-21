import type { JSONContent } from '@tiptap/core';

export const getTiptapText = (node: JSONContent): string => {
  if (node.type === 'text') return node.text ?? '';
  if (node.type === 'hardBreak') return '\n';

  const isTextBlock =
    node.type === 'paragraph' || node.type === 'heading' || node.type === 'codeBlock';

  return (node.content ?? []).map(getTiptapText).join(isTextBlock ? '' : '\n');
};
