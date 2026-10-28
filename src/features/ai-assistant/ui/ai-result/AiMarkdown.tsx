'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { TableKit } from '@tiptap/extension-table';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import styles from './AiResult.module.css';

export function AiMarkdown({ text }: { text: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false, link: { openOnClick: false } }),
      Markdown,
      TableKit,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: text,
    contentType: 'markdown',
    editable: false,
    immediatelyRender: false,
    editorProps: { attributes: { class: styles.markdown, 'aria-label': 'Ответ ИИ' } },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(text, { contentType: 'markdown', emitUpdate: false });
    }
  }, [editor, text]);

  return <EditorContent editor={editor} />;
}
