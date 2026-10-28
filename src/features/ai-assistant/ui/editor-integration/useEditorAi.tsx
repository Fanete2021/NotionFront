'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { AiApplyMode, AiSession } from '../../model/ai-types';
import { AiMenu } from '../ai-popover/AiMenu';
import { AiPopover } from '../ai-popover/AiPopover';
import { AiAction } from '@entities/ai-assistant';

type EditorAiSession = AiSession & {
  editor: Editor;
  range: { from: number; to: number };
};

function EditorAiPopover({
  session,
  onClose,
}: {
  session: EditorAiSession;
  onClose: (restoreFocus?: boolean) => void;
}) {
  const { editor, range } = session;

  // Document changes invalidate the captured positions, including remote edits.
  useEffect(() => {
    const close = () => onClose();
    editor.on('update', close);
    editor.on('destroy', close);
    return () => {
      editor.off('update', close);
      editor.off('destroy', close);
    };
  }, [editor, onClose]);

  const getAnchorRect = useCallback(() => {
    const start = editor.view.coordsAtPos(Math.min(range.from, editor.state.doc.content.size));
    const end = editor.view.coordsAtPos(Math.min(range.to, editor.state.doc.content.size));
    return { left: start.left, top: start.top, bottom: end.bottom };
  }, [editor, range.from, range.to]);

  const applyResult = (text: string, mode: AiApplyMode) => {
    if (editor.isDestroyed || !editor.isEditable) return;
    const end = editor.state.doc.resolve(range.to);
    const position = mode === 'replace' ? range : end.depth > 0 ? end.after(1) : range.to;
    const applied = editor
      .chain()
      .focus()
      .insertContentAt(position, text, {
        contentType: 'markdown',
      })
      .run();
    if (applied) onClose(true);
  };

  return (
    <AiPopover
      session={session}
      getAnchorRect={getAnchorRect}
      onClose={onClose}
      onApply={applyResult}
    />
  );
}

export function useEditorAi() {
  const [session, setSession] = useState<EditorAiSession | null>(null);

  const open = (editor: Editor, initialAction: AiAction) => {
    const { from, to } = editor.state.selection;
    setSession({
      editor,
      initialAction,
      range: { from, to },
      selectedText: editor.state.doc.textBetween(from, to, '\n'),
      originalText: editor.getText(),
    });
  };

  return {
    onAskAi: (editor: Editor) => open(editor, 'write'),
    isOverlayOpen: (editor: Editor) => session?.editor === editor,
    renderBubbleActions: (editor: Editor, onOpen: () => void) => (
      <AiMenu
        onOpen={onOpen}
        onSelect={(action) => {
          open(editor, action);
          editor.commands.setMeta('textEditorBubble', 'hide');
        }}
      />
    ),
    renderOverlay: (editor: Editor) =>
      session?.editor === editor ? (
        <EditorAiPopover
          session={session}
          onClose={(restoreFocus) => {
            setSession(null);
            if (restoreFocus && !editor.isDestroyed) editor.commands.focus();
          }}
        />
      ) : null,
  };
}
