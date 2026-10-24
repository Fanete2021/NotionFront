'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import type { Content, Editor } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import { TextSelection, type Selection } from '@tiptap/pm/state';
import classNames from 'classnames';
import { useState, useEffect, useRef } from 'react';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import styles from './TextEditor.module.css';
import { SlashCommands } from './lib/slash-commands';
import ImageUploadNode from './ui/image-upload-node/ImageUploadNode';
import VideoUploadNode from './ui/video-upload-node/VideoUploadNode';
import VideoNode from './ui/video-node/VideoNode';
import { UploadFileContext, type UploadFile } from './model/uploadFileContext';
import type { YjsSocketProvider } from '@/entities/page';
import { Button } from '@shared/ui/button';
import ChainIcon from '@shared/assets/icons/chain-icon.svg';
import PaletteIcon from '@shared/assets/icons/palette.svg';
import TableIcon from '@shared/assets/icons/editor-table.svg';
import { Typography } from '@shared/ui/typography';
import XCloseIcon from '@shared/assets/icons/x-close-2.svg';
import PlusIcon from '@shared/assets/icons/plus.svg';
import DivideIcon from '@shared/assets/icons/divide.svg';
import CommentIcon from '@shared/assets/icons/comment.svg';
import {
  CommentAnchor,
  createCommentAnchorId,
  setCommentAnchorClickHandler,
} from '@shared/lib/tiptap/comment-anchor';

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
  content?: string | Record<string, unknown> | null;
  editable?: boolean;
  onChange?: (json: Record<string, unknown>) => void;
  onUploadFile?: UploadFile;
  provider?: YjsSocketProvider | null;
  user?: { name: string; color: string } | null;
  onEditorReady?: (editor: Editor | null) => void;
  /** Якоря комментариев, которые нужно подсветить. */
  commentAnchorIds?: string[];
  activeCommentAnchorId?: string | null;
  /** Включает кнопку «Комментировать» в меню выделения. Якорь уже поставлен в текст. */
  onCommentAdd?: (anchorId: string) => void;
  onCommentAnchorClick?: (anchorId: string) => void;
};

const NO_ANCHORS: string[] = [];

const uploadLocalFile: UploadFile = (file) => Promise.resolve(URL.createObjectURL(file));

function isTextSelection(selection: Selection): selection is TextSelection {
  return selection instanceof TextSelection;
}

export const TextEditor = ({
  content = '',
  editable = true,
  onChange,
  onUploadFile,
  provider,
  user,
  onEditorReady,
  commentAnchorIds = NO_ANCHORS,
  activeCommentAnchorId = null,
  onCommentAdd,
  onCommentAnchorClick,
}: TextEditorProps) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const onChangeRef = useRef(onChange);
  const onEditorReadyRef = useRef(onEditorReady);
  useEffect(() => {
    onChangeRef.current = onChange;
    onEditorReadyRef.current = onEditorReady;
  }, [onChange, onEditorReady]);

  const initialJsonRef = useRef<string | null>(null);
  const isCollaborative = Boolean(provider);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          link: { openOnClick: false },
          dropcursor: { color: '#6366F1', width: 2 },
          ...(isCollaborative ? { undoRedo: false } : {}),
        }),

        TaskList,
        TaskItem.configure({ nested: true }),

        SlashCommands,
        TextStyle,
        Color,
        Image,
        ImageUploadNode,
        VideoUploadNode,
        VideoNode,

        TableKit.configure({
          table: { resizable: true },
        }),

        CommentAnchor.configure({
          highlightClass: styles.commentAnchor,
          activeClass: styles.commentAnchorActive,
        }),

        ...(provider
          ? [
              Collaboration.configure({
                document: provider.doc,
              }),
              CollaborationCaret.configure({
                provider,
                user: user ?? { name: 'Гость', color: '#6366F1' },
              }),
            ]
          : []),
      ],
      content: isCollaborative ? undefined : ((content ?? '') as Content),
      editable,
      immediatelyRender: false,
      onUpdate: ({ editor: ed }) => {
        const json = ed.getJSON();

        if (!isCollaborative) {
          const serialized = JSON.stringify(json);

          if (initialJsonRef.current === null) {
            initialJsonRef.current = serialized;
            return;
          }
          if (serialized === initialJsonRef.current) return;
        }

        onChangeRef.current?.(json as Record<string, unknown>);
      },
      editorProps: {
        attributes: {
          class: styles.editor,
        },
      },
    },
    [provider],
  );

  useEffect(() => {
    if (editor && initialJsonRef.current === null && !isCollaborative) {
      initialJsonRef.current = JSON.stringify(editor.getJSON());
    }
  }, [editor, isCollaborative]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;
    onEditorReadyRef.current?.(editor);
    return () => onEditorReadyRef.current?.(null);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    setCommentAnchorClickHandler(editor, onCommentAnchorClick ?? null);
  }, [editor, onCommentAnchorClick]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.commands.setCommentHighlights({
      anchorIds: commentAnchorIds,
      activeAnchorId: activeCommentAnchorId,
    });
  }, [editor, commentAnchorIds, activeCommentAnchorId]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (!editor.isActive('table')) {
        setIsTableOpen(false);
      }
    };

    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

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
      table: ed?.isActive('table') ?? false,
      hasSelection: ed ? !ed.state.selection.empty : false,
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

  const handleCommentClick = () => {
    if (!editor || !onCommentAdd) return;

    const anchorId = createCommentAnchorId();
    if (!editor.chain().focus().setCommentAnchor(anchorId).run()) return;

    // Снимаем выделение, чтобы меню закрылось, а фокус ушёл в форму комментария.
    editor.commands.setTextSelection(editor.state.selection.to);
    setIsColorOpen(false);
    setIsTableOpen(false);
    onCommentAdd(anchorId);
  };

  const handleShouldShow = () => {
    if (!editable || !editor) return false;
    if (editor.isActive('table')) return true;

    const selection = editor?.state.selection;
    return selection ? isTextSelection(selection) && !selection.empty : false;
  };

  const currentColor = activeMarks?.color ?? null;

  const runTableCommand = (command: () => void) => {
    command();
    setIsTableOpen(false);
  };

  return (
    <div className={styles.root}>
      {editor && (
        <>
          <DragHandle editor={editor}>
            <div className={styles.dragHandle}>⋮⋮</div>
          </DragHandle>
          <BubbleMenu editor={editor} className={styles.bubble} shouldShow={handleShouldShow}>
            <Button
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
              variant="clear"
              size="sm"
              square
              aria-label="Цвет текста"
              className={classNames(styles.bubbleButton, {
                [styles.bubbleButtonActive]: isColorOpen || currentColor !== null,
              })}
              onClick={() => {
                setIsColorOpen((open) => !open);
                setIsTableOpen(false);
              }}
            >
              <PaletteIcon className={styles.bubbleIcon} />
            </Button>
            {onCommentAdd && activeMarks?.hasSelection ? (
              <Button
                variant="clear"
                size="sm"
                square
                aria-label="Комментировать"
                title="Комментировать"
                className={styles.bubbleButton}
                onClick={handleCommentClick}
              >
                <CommentIcon className={styles.bubbleIcon} />
              </Button>
            ) : null}

            {isColorOpen && (
              <div className={styles.colorPanel}>
                {textColors.map(({ value, colorName }) => {
                  const isResetSwatch = value === null;
                  const isSwatchActive = isResetSwatch
                    ? currentColor === null
                    : currentColor === value;

                  return (
                    <Button
                      key={isResetSwatch ? 'default' : value}
                      variant="clear"
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

            {activeMarks?.table && (
              <div className={styles.tableMenuWrapper}>
                <Button
                  variant="clear"
                  size="sm"
                  square
                  aria-label="Действия с таблицей"
                  className={classNames(styles.bubbleButton, {
                    [styles.bubbleButtonActive]: isTableOpen,
                  })}
                  onClick={() => {
                    setIsTableOpen((open) => !open);
                    setIsColorOpen(false);
                  }}
                >
                  <TableIcon className={styles.bubbleIcon} />
                </Button>

                {isTableOpen && (
                  <div className={styles.tablePanel}>
                    <Button
                      variant="clear"
                      className={styles.tablePanelItem}
                      onClick={() =>
                        runTableCommand(() => editor.chain().focus().addRowAfter().run())
                      }
                    >
                      <PlusIcon className={styles.icon} />
                      Добавить строку
                    </Button>
                    <Button
                      variant="clear"
                      className={styles.tablePanelItem}
                      onClick={() =>
                        runTableCommand(() => editor.chain().focus().addColumnAfter().run())
                      }
                    >
                      <PlusIcon className={styles.icon} />
                      Добавить столбец
                    </Button>
                    <Button
                      variant="clear"
                      className={styles.tablePanelItem}
                      onClick={() =>
                        runTableCommand(() => editor.chain().focus().deleteRow().run())
                      }
                    >
                      <DivideIcon className={styles.icon} />
                      Удалить строку
                    </Button>
                    <Button
                      variant="clear"
                      className={styles.tablePanelItem}
                      onClick={() =>
                        runTableCommand(() => editor.chain().focus().deleteColumn().run())
                      }
                    >
                      <DivideIcon className={styles.icon} />
                      Удалить столбец
                    </Button>
                    <div className={styles.tablePanelDivider} />
                    <Button
                      variant="clear"
                      className={classNames(styles.tablePanelItem, styles.tablePanelItemDanger)}
                      onClick={() =>
                        runTableCommand(() => editor.chain().focus().deleteTable().run())
                      }
                    >
                      <Typography variant="text-medium" className={styles.tablePanelIcon}>
                        <XCloseIcon />
                      </Typography>
                      Удалить таблицу
                    </Button>
                  </div>
                )}
              </div>
            )}
          </BubbleMenu>
        </>
      )}
      <UploadFileContext value={onUploadFile ?? uploadLocalFile}>
        <EditorContent editor={editor} />
      </UploadFileContext>
    </div>
  );
};
