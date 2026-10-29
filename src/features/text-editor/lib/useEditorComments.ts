import { useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { getCommentAnchorsSelector } from '@shared/lib/tiptap/comment-anchor';

export type EditorComments = {
  anchorIds: string[];
  onAdd: (anchorId: string) => void;
  onEditorChange: (editor: Editor | null) => void;
};

export const useEditorComments = (editor: Editor | null, comments?: EditorComments) => {
  const onEditorChange = comments?.onEditorChange;

  useEffect(() => {
    if (!editor || editor.isDestroyed || !onEditorChange) return;
    onEditorChange(editor);
    return () => onEditorChange(null);
  }, [editor, onEditorChange]);

  const addComment = () => {
    if (!editor || !comments) return;

    const anchorId = crypto.randomUUID();
    editor
      .chain()
      .focus()
      .setCommentAnchor(anchorId)
      .setTextSelection(editor.state.selection.to)
      .run();
    comments.onAdd(anchorId);
  };

  const highlightSelector = getCommentAnchorsSelector(comments?.anchorIds ?? []);

  return { addComment, highlightSelector };
};
