'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import { TextSelection, type Selection } from '@tiptap/pm/state';
import classNames from 'classnames';
import { useState } from 'react';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import styles from './TextEditor.module.css';
import { SlashCommands } from './lib/slash-commands';
import ImageUploadNode from './ui/image-upload-node/ImageUploadNode';
import VideoUploadNode from './ui/video-upload-node/VideoUploadNode';
import VideoNode from './ui/video-node/VideoNode';
import { Button } from '@shared/ui/Button';
import ChainIcon from '@shared/assets/icons/chain-icon.svg';
import PaletteIcon from '@shared/assets/icons/palette.svg';

const textColors = [
  { value: null, colorName: 'Сбросить цвет' },
  { value: '#111827', colorName: 'Чёрный' },
  { value: '#EF4444', colorName: 'Красный' },
  { value: '#10B981', colorName: 'Зелёный' },
  { value: '#F59E0B', colorName: 'Оранжевый' },
  { value: '#2563EB', colorName: 'Синий' },
  { value: '#6366F1', colorName: 'Фиолетовый' },
] as const;

type TextEditorProps = {
  content?: string;
};

function isTextSelection(selection: Selection): selection is TextSelection {
  return selection instanceof TextSelection;
}

export const TextEditor = ({ content = '' }: TextEditorProps) => {
  const [isColorOpen, setIsColorOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),

      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      SlashCommands,
      TextStyle,
      Color,
      Image,
      ImageUploadNode,
      VideoUploadNode,
      VideoNode,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
  });

  const activeMarks = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      heading1: ed?.isActive('heading', { level: 1 }) ?? false,
      heading2: ed?.isActive('heading', { level: 2 }) ?? false,
      paragraph: ed?.isActive('paragraph') ?? false,
      bold: ed?.isActive('bold') ?? false,
      italic: ed?.isActive('italic') ?? false,
      underline: ed?.isActive('underline') ?? false,
      code: ed?.isActive('code') ?? false,
      link: ed?.isActive('link') ?? false,
      color: (ed?.getAttributes('textStyle')?.color as string | undefined) ?? null,
    }),
  });

  const handleLinkClick = () => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Введите URL', previousUrl ?? 'https://');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleShouldShow = () => {
    const selection = editor?.state.selection;

    return selection ? isTextSelection(selection) && !selection.empty : false;
  };

  const currentColor = activeMarks?.color ?? null;

  return (
    <div className={styles.root}>
      {editor && (
        <BubbleMenu editor={editor} className={styles.bubble} shouldShow={handleShouldShow}>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Заголовок 1"
            className={classNames(styles.bubbleButton, {
              [styles.bubbleButtonActive]: activeMarks?.heading1,
            })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Заголовок 2"
            className={classNames(styles.bubbleButton, {
              [styles.bubbleButtonActive]: activeMarks?.heading2,
            })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Обычный текст"
            className={classNames(styles.bubbleButton, {
              [styles.bubbleButtonActive]: activeMarks?.paragraph,
            })}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Т
          </Button>
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
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Ссылка"
            className={classNames(styles.bubbleButton, {
              [styles.bubbleButtonActive]: activeMarks?.link,
            })}
            onClick={handleLinkClick}
          >
            <ChainIcon className={styles.bubbleIcon} />
          </Button>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            aria-label="Цвет текста"
            className={classNames(styles.bubbleButton, {
              [styles.bubbleButtonActive]: isColorOpen || currentColor !== null,
            })}
            onClick={() => setIsColorOpen((open) => !open)}
          >
            <PaletteIcon className={styles.bubbleIcon} />
          </Button>

          {isColorOpen && (
            <div className={styles.colorPanel}>
              {textColors.map(({ value, colorName }) => {
                const isResetSwatch = value === null;
                const isSwatchActive = isResetSwatch
                  ? currentColor === null
                  : currentColor === value;

                return (
                  <button
                    key={isResetSwatch ? 'default' : value}
                    type="button"
                    aria-label={colorName}
                    className={classNames(styles.colorSwatch, {
                      [styles.colorSwatchDefault]: isResetSwatch,
                      [styles.colorSwatchActive]: isSwatchActive,
                    })}
                    style={isResetSwatch ? undefined : { backgroundColor: value }}
                    onClick={() => {
                      if (isResetSwatch) {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(value).run();
                      }
                      setIsColorOpen(false);
                    }}
                  />
                );
              })}
            </div>
          )}
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
