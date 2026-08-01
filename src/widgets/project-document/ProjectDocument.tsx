'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@shared/ui/Button';
import classNames from 'classnames';
import styles from './ProjectDocument.module.css';

const initialContent = `
  <h2>Обзор</h2>
  <p>Здесь собраны базовые UI-компоненты дизайн-системы: кнопки, поля ввода и типографика.</p>
  <h2>Кнопки</h2>
  <p>Кнопка — основной элемент действий. Варианты: primary, secondary и ghost.</p>
`;

export const ProjectDocument = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
  });

  // Подписка на marks: при смене выделения React перерисует кнопки
  const activeMarks = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      bold: ed?.isActive('bold') ?? false,
      italic: ed?.isActive('italic') ?? false,
      underline: ed?.isActive('underline') ?? false,
      code: ed?.isActive('code') ?? false,
    }),
  });

  return (
    <div className={styles.root}>
      {editor && (
        <BubbleMenu editor={editor} className={styles.bubble}>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Жирный"
            className={classNames(styles.bubbleButton, {
              [styles.bubbleButtonActive]: activeMarks?.bold,
            })}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </Button>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Курсив"
            className={classNames(styles.bubbleButton, styles.bubbleButtonItalic, {
              [styles.bubbleButtonActive]: activeMarks?.italic,
            })}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </Button>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Подчёркнутый"
            className={classNames(styles.bubbleButton, styles.bubbleButtonUnderline, {
              [styles.bubbleButtonActive]: activeMarks?.underline,
            })}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            U
          </Button>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Код"
            className={classNames(styles.bubbleButton, styles.bubbleButtonCode, {
              [styles.bubbleButtonActive]: activeMarks?.code,
            })}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            {'</>'}
          </Button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
